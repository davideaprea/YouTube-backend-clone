import { Types } from "mongoose";
import { Dislikeable } from "./dislikeable.type.js";
import { Likeable } from "./likeable.type.js";
import { VideoInteraction } from "./video-interaction.type.js";

export type Comment = Likeable & Dislikeable & VideoInteraction & {
    readonly content: string,
    readonly parentCommentId?: Types.ObjectId,
    readonly repliedToId?: Types.ObjectId
}