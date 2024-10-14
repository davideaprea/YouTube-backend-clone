import { transactionHandler } from "../../core/utilities/transaction-handler";
import { CommentLikeDislikeModel } from "../models/comment-like-or-dislike.model";
import { CommentModel } from "../models/comment.model";
import { VideoModel } from "../models/video.model";
import { CommentDto } from "../types/dtos/comment-dto.type";

export const createComment = async (dto: CommentDto) => {
    return await transactionHandler(async session => {
        await VideoModel.updateOne(
            { _id: dto.videoId },
            { $inc: { comments: 1 } },
            { session }
        );
        return await CommentModel.create([dto], { session });
    });
}

export const deleteComment = async (id: string) => {
    transactionHandler(async session => {
        await CommentModel.deleteMany(
            {
                $or: [
                    { _id: id },
                    { parentCommentId: id }
                ]
            },
            { session }
        );
        await CommentLikeDislikeModel.deleteMany({ commentId: id }, { session });
    });
}