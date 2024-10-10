import { Router } from "express";
import { verifyJwt } from "../../auth/middlewares/jwt-checker.middleware";
import { multerConfig } from "../../core/constants/multer-config";
import { addLikeDislike, handleAddView, handleCreateVideo, handleDeleteVideo, handleEditVideo, removeLikeDislike, handleSearchVideos } from "../controllers/video.controller";
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
    .delete(verifyJwt, handleDeleteVideo)
    .patch(verifyJwt, handleEditVideo);

videoRouter.route("/:id/view").patch(handleAddView);

videoRouter.route("/:id/like-dislike/:interaction").patch(verifyJwt, addLikeDislike);

videoRouter.route("/:id/like-dislike").delete(verifyJwt, removeLikeDislike);

videoRouter.route("/:title/:limit/:lastId?").get(handleSearchVideos);