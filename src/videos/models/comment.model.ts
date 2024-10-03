import { model, Schema } from "mongoose";
import { Comment } from "../types/comment.type";
import { likesDislikesProperty } from "../constants/likes-dislikes.property";
import { postIdProperty, timeProperty, userIdProperty } from "../constants/post-interaction.property";
import { VideoSchemaNames } from "../types/video-schema-names.enum";

const commentSchema = new Schema<Comment>({
    userId: userIdProperty,
    postId: postIdProperty,
    time: timeProperty,
    likes: likesDislikesProperty,
    dislikes: likesDislikesProperty,
    content: {
        type: String,
        maxlength: [500, "Comments can't have more than 500 characters."],
        trim: true
    },
    parentCommentId: {
        type: Schema.Types.ObjectId,
        ref: VideoSchemaNames.COMMENT
    },
    repliedToId: {
        type: Schema.Types.ObjectId,
        ref: VideoSchemaNames.COMMENT
    }
});

export const CommentModel = model(VideoSchemaNames.COMMENT, commentSchema);