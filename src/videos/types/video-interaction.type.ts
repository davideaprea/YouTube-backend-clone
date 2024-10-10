import { Types } from "mongoose";
import { UserInteraction } from "./user-interaction.type.js";

export type VideoInteraction = UserInteraction & {
    readonly videoId: Types.ObjectId
}