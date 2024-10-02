import { Types } from "mongoose";
import { UserInteraction } from "./user-interaction.type";

export type PostInteraction = UserInteraction & {
    readonly postId: Types.ObjectId
}