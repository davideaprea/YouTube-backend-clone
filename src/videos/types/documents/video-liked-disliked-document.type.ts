import { Document } from "mongoose";
import { VideoLikedOrDisliked } from "../video-liked-or-disliked.type";

export type VideoLikeDislikeDocument = VideoLikedOrDisliked & Document;