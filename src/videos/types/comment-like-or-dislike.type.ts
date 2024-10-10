import { CommentInteraction } from "./comment-interaction.type";
import { LikedOrDisliked } from "./likedOrDisliked.type";

export type CommentLikeOrDislike = CommentInteraction & LikedOrDisliked;