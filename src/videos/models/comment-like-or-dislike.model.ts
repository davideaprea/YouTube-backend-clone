import { model, Schema } from "mongoose";
import { userIdProperty, timeProperty } from "../constants/video-interaction.property.js";
import { CommentLikeOrDislike } from "../types/comment-like-or-dislike.type.js";
import { VideoSchemaNames } from "../types/video-schema-names.enum.js";

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