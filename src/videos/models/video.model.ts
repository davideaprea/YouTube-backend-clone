import { model, Schema } from "mongoose";
import { Video } from "../types/video.type";
import { VideoSchemaNames } from "../types/video-schema-names.enum";
import { likesDislikesProperty } from "../constants/likes-dislikes.property";
import { timeProperty, userIdProperty } from "../constants/post-interaction.property";

const videoSchema = new Schema<Video>({
    creatorId: userIdProperty,
    createdAt: timeProperty,
    description: {
        type: String,
        maxlength: [5000, "Video descriptions can't be above 5000 characters."]
    },
    source: {
        type: String,
        required: true,
        immutable: true
    },
    thumbnail: String,
    title: {
        type: String,
        required: true,
        maxlength: [100, "Video titles can't be above 100 characters."]
    },
    views: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    likes: likesDislikesProperty,
    dislikes: likesDislikesProperty,
    allowComments: {
        type: Boolean,
        default: true,
        required: true
    }
});

export const VideoModel = model(VideoSchemaNames.VIDEO, videoSchema);