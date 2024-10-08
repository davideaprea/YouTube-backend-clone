import { model, Schema } from "mongoose";
import { Video } from "../types/video.type";
import { VideoSchemaNames } from "../types/video-schema-names.enum";
import { likesDislikesProperty } from "../constants/likes-dislikes.property";
import { timeProperty, userIdProperty } from "../constants/video-interaction.property";
import { HttpError } from "../../core/utilities/http-error.class";

const videoSchema = new Schema<Video>({
    creator: userIdProperty,
    createdAt: timeProperty,
    description: {
        type: String,
        maxlength: [5000, "Video descriptions can't be above 5000 characters."]
    },
    source: {
        type: String,
        required: [true, "Video source is missing."],
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
    },
    chapters: [{
        from: {
            required: [true, "Chapter's starting time is required."],
            type: Number,
            min: 0
        },
        title: {
            type: String,
            required: [String, "Chapter's title is required."],
            maxlength: [100, "Chapter titles can't be above 100 characters."]
        }
    }]
});

videoSchema.pre("save", function (next) {
    const chapters = this.chapters;

    if (!chapters || chapters.length < 1) return next();

    chapters.sort((a, b) => a.from - b.from);

    for (let i = 1; i < chapters.length; i++) {
        if (chapters[i].from - chapters[i - 1].from < 10) {
            return next(new HttpError(400, "Every chapter must be at least 10 seconds long."));
        }
    }

    next();
});

videoSchema.index({ title: "text" });

export const VideoModel = model(VideoSchemaNames.VIDEO, videoSchema);