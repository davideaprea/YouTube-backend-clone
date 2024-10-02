import { model, Schema } from "mongoose";
import { Video } from "../types/video.type";
import { VideoSchemaNames } from "../types/video-schema-names.enum";
import { likesDislikesProperty } from "../constants/likes-dislikes.property";

const videoSchema = new Schema<Video>({
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        immutable: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date(),
        immutable: true
    },
    description: {
        type: String,
        maxlength: [500, "Video descriptions can't be above 500 characters."]
    },
    source: {
        type: String,
        required: true,
        immutable: true
    },
    title: {
        type: String,
        required: true,
        maxlength: [100, "Video titles can't be above 100 characters."]
    },
    views: {
        type: Number,
        default: 0,
        min: 0
    },
    likes: { ...likesDislikesProperty },
    dislikes: { ...likesDislikesProperty },
});

export const VideoModel = model(VideoSchemaNames.VIDEO, videoSchema);