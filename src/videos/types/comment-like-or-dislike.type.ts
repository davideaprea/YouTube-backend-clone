import { CommentInteraction } from "./comment-interaction.type";

export type CommentLikeOrDislike = CommentInteraction & {
    liked: boolean
}