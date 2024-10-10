import { CommentLikeOrDislike } from "../comment-like-or-dislike.type.js";

export type VideoLikeDislikeDto = Omit<CommentLikeOrDislike, "time">;