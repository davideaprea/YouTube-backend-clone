import { model, Schema } from "mongoose";
import { CommentLikeOrDislike } from "../types/comment-like-or-dislike.type";
import { timeProperty, userIdProperty } from "../constants/post-interaction.property";
import { VideoSchemaNames } from "../types/video-schema-names.enum";

const commentLikeDislikeSchema = new Schema<CommentLikeOrDislike>({
    userId: userIdProperty,
    time: timeProperty,
    liked: {
        type: Boolean,
        required: true
    },
    commentId: {
        required: true,
        immutable: true,
        type: Schema.Types.ObjectId,
        ref: VideoSchemaNames.COMMENT
    }
});

export const CommentLikeDislikeModel = model(VideoSchemaNames.COMMENT_LIKE_DISLIKE, commentLikeDislikeSchema);