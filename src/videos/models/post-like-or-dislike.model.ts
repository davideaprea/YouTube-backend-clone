import { model, Schema } from "mongoose";
import { VideoSchemaNames } from "../types/video-schema-names.enum";
import { userIdProperty, postIdProperty, timeProperty } from "../constants/post-interaction.property";
import { PostLikedOrDisliked } from "../types/post-liked-or-disliked.type";

const likeDislike = new Schema<PostLikedOrDisliked>({
    userId: userIdProperty,
    postId: postIdProperty,
    time: timeProperty,
    liked: {
        type: Boolean,
        required: true
    }
});

likeDislike.index({ postId: 1, userId: 1 }, { unique: true });

export const PostLikeDislikeModel = model(VideoSchemaNames.POST_LIKE_DISLIKE, likeDislike);