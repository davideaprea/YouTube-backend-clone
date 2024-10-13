import { Types } from "mongoose"
import { Likeable } from "./likeable.type"
import { Dislikeable } from "./dislikeable.type"
import { UserRelatedObj } from "../../core/types/user-related-obj.type"

export type Video = UserRelatedObj & Likeable & Dislikeable & {
    readonly _id: Types.ObjectId,
    readonly createdAt: Date,
    title: string,
    description?: string,
    source: string,
    views: number
    thumbnail?: string
    allowComments: boolean,
    chapters?: {
        from: number,
        title: string
    }[]
}