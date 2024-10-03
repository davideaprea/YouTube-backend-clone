import { Types } from "mongoose";
import { Dislikeable } from "./dislikeable.type";
import { Likeable } from "./likeable.type";
import { PostInteraction } from "./post-interaction.type";

export type Comment = Likeable & Dislikeable & PostInteraction & {
    readonly content: string,
    readonly parentCommentId?: Types.ObjectId,
    readonly repliedToId?: Types.ObjectId
}