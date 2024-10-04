import { Types } from "mongoose"
import { Likeable } from "./likeable.type"
import { Dislikeable } from "./dislikeable.type"

export type Video = Likeable & Dislikeable & {
    readonly creatorId: Types.ObjectId,
    readonly createdAt: Date,
    title: string,
    description: string,
    source: string,
    views: number
    thumbnail?: string
    allowComments: boolean
}