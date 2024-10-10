import { VideoLikedOrDisliked } from "../video-liked-or-disliked.type.js";

export type VideoLikeDislikeDto = Omit<VideoLikedOrDisliked, "time">;