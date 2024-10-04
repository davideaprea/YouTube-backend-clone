import { Comment } from "../comment.type";

export type CommentDto = Omit<Comment, "dislikes" | "likes" | "time">;