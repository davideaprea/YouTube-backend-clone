import { CommentLikeOrDislike } from "../comment-like-or-dislike.type";

export type VideoLikeDislikeDto = Omit<CommentLikeOrDislike, "time">;