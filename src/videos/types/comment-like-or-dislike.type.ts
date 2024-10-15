import { CommentInteraction } from "./comment-interaction.type";
import { LikedOrDisliked } from "./liked-or-disliked.type";

export type CommentLikeOrDislike = CommentInteraction & LikedOrDisliked;