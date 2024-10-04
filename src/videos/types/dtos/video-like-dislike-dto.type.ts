import { VideoLikedOrDisliked } from "../video-liked-or-disliked.type";

export type VideoLikeDislikeDto = Omit<VideoLikedOrDisliked, "time">;