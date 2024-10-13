import { UserRelatedObj } from "../../core/types/user-related-obj.type"

export type UserInteraction = UserRelatedObj & {
    readonly time: Date
}