import { transactionHandler } from "../../core/utilities/transaction-handler";
import { CommentLikeDislikeModel } from "../models/comment-like-or-dislike.model";
import { CommentModel } from "../models/comment.model";
import { VideoModel } from "../models/video.model";
import { CommentDocument } from "../types/documents/comment-document.type";
import { CommentDto } from "../types/dtos/comment-dto.type";

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

export const deleteComment = async (id: string, userId: string): Promise<void> => {
    transactionHandler<void>(async session => {
        const comment: CommentDocument | null = await CommentModel.findOneAndDelete({ _id: id, userId }, { session });

        if (!comment) return;

        let deletedComments: number;

        if (comment.parentCommentId) {
            deletedComments = 1
        }
        else {
            const delResult = await CommentModel.deleteMany(
                { parentCommentId: id },
                { session }
            );

            deletedComments = delResult.deletedCount + 1;
        }

        await VideoModel.updateOne(
            { _id: comment.videoId },
            { $inc: { comments: -deletedComments } },
            { session }
        );

        await CommentLikeDislikeModel.deleteMany({ commentId: id }, { session });
    });
}