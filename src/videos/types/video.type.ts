import { Types } from "mongoose"
import { Likeable } from "./likeable.type"
import { Dislikeable } from "./dislikeable.type"

export type Video = Likeable & Dislikeable & {
    readonly _id: Types.ObjectId,
    readonly creator: Types.ObjectId,
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