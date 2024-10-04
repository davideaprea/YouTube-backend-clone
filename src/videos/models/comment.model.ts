import { model, Schema } from "mongoose";
import { Comment } from "../types/comment.type";
import { likesDislikesProperty } from "../constants/likes-dislikes.property";
import { videoIdProperty, timeProperty, userIdProperty } from "../constants/video-interaction.property";
import { VideoSchemaNames } from "../types/video-schema-names.enum";
import { AuthSchemaNames } from "../../auth/types/auth-schema-names.enum";

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