import { Router } from "express";
import { verifyJwt } from "../../auth/middlewares/jwt-checker.middleware";
import { multerConfig } from "../../core/constants/multer-config";
import { createVideo, deleteVideo, editVideo } from "../controllers/video.controller";

export const videoRouter: Router = Router();

videoRouter.route("/").post(
    verifyJwt,
    multerConfig.fields([
        { name: "source", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    createVideo
);

videoRouter.route("/:id")
    .delete(verifyJwt, deleteVideo)
    .put(verifyJwt, editVideo);