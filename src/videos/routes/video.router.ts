import { Router } from "express";
import { verifyJwt } from "../../auth/middlewares/jwt-checker.middleware";
import { multerConfig } from "../../core/constants/multer-config";
import { addLikeDislike, addView, handleCreateVideo, deleteVideo, editVideo, removeLikeDislike, searchVideos } from "../controllers/video.controller";
import { addFilesToBody } from "../../core/middlewares/add-files-to-body.middleware";

export const videoRouter: Router = Router();

videoRouter.route("/").post(
    verifyJwt,
    multerConfig.fields([
        { name: "source", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    addFilesToBody,
    handleCreateVideo
);

videoRouter.route("/:id")
    .delete(verifyJwt, deleteVideo)
    .patch(verifyJwt, editVideo);

videoRouter.route("/:id/view").patch(addView);

videoRouter.route("/:id/like-dislike/:interaction").patch(verifyJwt, addLikeDislike);

videoRouter.route("/:id/like-dislike").delete(verifyJwt, removeLikeDislike);

videoRouter.route("/:title/:limit/:lastId?").get(searchVideos);