import { PostInteraction } from "./post-interaction.type";

export type PostLikedOrDisliked = PostInteraction & {
    liked: boolean
}