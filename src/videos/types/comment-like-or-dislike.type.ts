import { CommentInteraction } from "./comment-interaction.type.js";
import { LikedOrDisliked } from "./likedOrDisliked.type.js";

export type CommentLikeOrDislike = CommentInteraction & LikedOrDisliked;