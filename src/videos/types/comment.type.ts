import { Types } from "mongoose";
import { Dislikeable } from "./dislikeable.type";
import { Likeable } from "./likeable.type";
import { VideoInteraction } from "./video-interaction.type";

export type Comment = Likeable & Dislikeable & VideoInteraction & {
    readonly content: string,
    readonly parentCommentId?: Types.ObjectId,
    readonly repliedToId?: Types.ObjectId
}