import { Comment } from "../comment.type.js";

export type CommentDto = Omit<Comment, "dislikes" | "likes" | "time">;