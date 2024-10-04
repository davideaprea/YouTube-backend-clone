import { model, Schema } from "mongoose";
import { Video } from "../types/video.type";
import { VideoSchemaNames } from "../types/video-schema-names.enum";
import { likesDislikesProperty } from "../constants/likes-dislikes.property";
import { timeProperty, userIdProperty } from "../constants/post-interaction.property";
import { HttpError } from "../../core/utilities/http-error.class";

const videoSchema = new Schema<Video>({
    creatorId: userIdProperty,
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
    duration: {
        type: Number,
        immutable: true,
        required: true
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
            min: 0,
            validate: {
                validator: function (value) {
                    return value <= this.duration;
                },
                message: "Chapter 'from' must be less than or equal to the video duration."
            }
        },
        title: {
            type: [String, "Chapter's title is required."],
            required: true,
            maxlength: [100, "Chapter titles can't be above 100 characters."]
        }
    }]
});

videoSchema.pre("save", function (next) {
    const chapters = this.chapters;

    if(!chapters || chapters.length < 1) return next();

    chapters.sort((a, b) => a.from - b.from);

    for(let i = 0; i < chapters.length - 1; i++) {
        if(chapters[i - 1].from - chapters[i].from < 10) {
            return next(new HttpError(400, "Every chapter must be at least 10 seconds long."));
        }
    }

    next();
});

export const VideoModel = model(VideoSchemaNames.VIDEO, videoSchema);