import { Document } from "mongoose";
import { Comment } from "../comment.type";

export type CommentDocument = Comment & Document;