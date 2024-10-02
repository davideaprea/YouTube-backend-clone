import { Dislikeable } from "./dislikeable.type";
import { Likeable } from "./likeable.type";
import { PostInteraction } from "./post-interaction.type";

export type Comment = Likeable & Dislikeable & PostInteraction & {
    content: string
}