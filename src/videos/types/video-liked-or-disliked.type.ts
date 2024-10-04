import { VideoInteraction } from "./video-interaction.type";

export type VideoLikedOrDisliked = VideoInteraction & {
    liked: boolean
}