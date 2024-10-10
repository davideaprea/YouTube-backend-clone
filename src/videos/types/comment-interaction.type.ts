import { Types } from "mongoose"
import { UserInteraction } from "./user-interaction.type.js"

export type CommentInteraction = UserInteraction & {
    readonly commentId: Types.ObjectId
}