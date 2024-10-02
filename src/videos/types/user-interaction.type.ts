import { Types } from "mongoose"

export type UserInteraction = {
    readonly userId: Types.ObjectId,
    readonly time: Date
}