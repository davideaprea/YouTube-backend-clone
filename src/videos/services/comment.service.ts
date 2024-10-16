import { Types } from "mongoose";
import { transactionHandler } from "../../core/utilities/transaction-handler";
import { CommentLikeDislikeModel } from "../models/comment-like-or-dislike.model";
import { CommentModel } from "../models/comment.model";
import { VideoModel } from "../models/video.model";
import { CommentDocument } from "../types/documents/comment-document.type";
import { CommentDto } from "../types/dtos/comment-dto.type";

export const getVideoComments = async (videoId: string, limit: number = 10, lastCommentId?: string): Promise<CommentDocument[]> => {
    const query: Record<string, any> = { videoId };

    if (lastCommentId) query._id = { $gt: lastCommentId };
    if (limit > 50 || limit <= 0) limit = 10;

    return await CommentModel
        .find(query)
        .sort({ _id: 1 })
        .limit(limit);
}

export const createComment = async (dto: CommentDto): Promise<CommentDocument> => {
    return await transactionHandler<CommentDocument>(async session => {
        await VideoModel.updateOne(
            { _id: dto.videoId },
            { $inc: { comments: 1 } },
            { session }
        );
        return await CommentModel.create([dto], { session });
    });
}

export const deleteComment = async (videoId: string, commentId: string, userId: string): Promise<void> => {
    transactionHandler<void>(async session => {
        const comment = await CommentModel.findOneAndDelete({ _id: commentId, userId }, { session });

        if (!comment) return;

        const deletedDocumentIds: Types.ObjectId[] = [comment._id];
        let deletedComments: number = 1;

        if (!comment.parentCommentId) {
            const replies = await CommentModel.find(
                { videoId, parentCommentId: commentId },
                { _id: 1 },
                { session }
            );

            for (const reply of replies) {
                deletedDocumentIds.push(reply._id);
            }

            const delResult = await CommentModel.deleteMany(
                { videoId, parentCommentId: commentId },
                { session }
            );

            deletedComments += delResult.deletedCount;
        }

        await VideoModel.updateOne(
            { _id: comment.videoId },
            { $inc: { comments: -deletedComments } },
            { session }
        );

        await CommentLikeDislikeModel.deleteMany(
            { commentId: { $in: deletedDocumentIds } },
            { session }
        );
    });
}