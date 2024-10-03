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
        maxlength: [1000, "Video descriptions can't have more than 1000 characters."],
        trim: true
    }
});

export const CommentModel = model(VideoSchemaNames.COMMENT, commentSchema);