import { model, Schema } from "mongoose";
import { userIdProperty, videoIdProperty, timeProperty } from "../constants/video-interaction.property.js";
import { VideoLikedOrDisliked } from "../types/video-liked-or-disliked.type.js";
import { VideoSchemaNames } from "../types/video-schema-names.enum.js";

const likeDislike = new Schema<VideoLikedOrDisliked>({
    userId: userIdProperty,
    videoId: videoIdProperty,
    time: timeProperty,
    liked: {
        type: Boolean,
        required: true
    }
});

likeDislike.index({ postId: 1, userId: 1 }, { unique: true });

export const VideoLikeDislikeModel = model(VideoSchemaNames.POST_LIKE_DISLIKE, likeDislike);