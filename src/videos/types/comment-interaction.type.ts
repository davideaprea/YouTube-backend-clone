import { Types } from "mongoose"
import { UserInteraction } from "./user-interaction.type"

export type CommentInteraction = UserInteraction & {
    readonly commentId: Types.ObjectId
}