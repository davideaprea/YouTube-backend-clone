import { model, Schema } from "mongoose";
import { Comment } from "../types/comment.type";
import { likesDislikesProperty } from "../constants/likes-dislikes.property";
import { videoIdProperty, timeProperty, userIdProperty } from "../constants/video-interaction.property";
import { VideoSchemaNames } from "../types/video-schema-names.enum";
import { AuthSchemaNames } from "../../auth/types/auth-schema-names.enum";
import { HttpError } from "../../core/utilities/http-error.class";

const commentSchema = new Schema<Comment>({
    userId: userIdProperty,
    videoId: videoIdProperty,
    time: timeProperty,
    likes: likesDislikesProperty,
    dislikes: likesDislikesProperty,
    content: {
        type: String,
        maxlength: [500, "Comments can't have more than 500 characters."],
        trim: true,
        required: true
    },
    parentCommentId: {
        type: Schema.Types.ObjectId,
        ref: VideoSchemaNames.COMMENT,
        immutable: true
    },
    repliedToId: {
        type: Schema.Types.ObjectId,
        ref: AuthSchemaNames.USER,
        immutable: true
    }
});

commentSchema.pre("save", function (next) {
    if (!this.parentCommentId && this.repliedToId) {
        next(new HttpError(400, "A top comment can't be a reply to another comment."));
    }

    next();
});

commentSchema.index({ videoId: 1, parentCommentId: 1 });

export const CommentModel = model(VideoSchemaNames.COMMENT, commentSchema);