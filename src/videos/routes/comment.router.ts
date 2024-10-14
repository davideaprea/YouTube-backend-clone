import { Router } from "express";
import { verifyJwt } from "../../auth/middlewares/jwt-checker.middleware";
import { handleCreateComment, handleDeleteComment } from "../controllers/comment.controller";

export const commentRouter: Router = Router();

commentRouter.route("/").post(verifyJwt, handleCreateComment);

commentRouter.route("/:id").delete(verifyJwt, handleDeleteComment);