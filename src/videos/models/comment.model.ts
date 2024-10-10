import { model, Schema } from "mongoose";
import { AuthSchemaNames } from "../../auth/types/auth-schema-names.enum.js";
import { likesDislikesProperty } from "../constants/likes-dislikes.property.js";
import { userIdProperty, videoIdProperty, timeProperty } from "../constants/video-interaction.property.js";
import { VideoSchemaNames } from "../types/video-schema-names.enum.js";
import { Comment } from "../types/comment.type.js";

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

export const CommentModel = model(VideoSchemaNames.COMMENT, commentSchema);