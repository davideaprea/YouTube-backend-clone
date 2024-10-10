import { Router } from "express";
import { verifyJwt } from "../../auth/middlewares/jwt-checker.middleware";
import { multerConfig } from "../../core/constants/multer-config";
import { handleAddInteraction, handleAddView, handleCreateVideo, handleDeleteVideo, handleEditVideo, removeLikeDislike, handleSearchVideos, handleEditInteraction } from "../controllers/video.controller";
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

videoRouter.route("/:id/interaction/:interactionType").patch(verifyJwt, handleAddInteraction);

videoRouter.route("/:id/interaction")
    .delete(verifyJwt, removeLikeDislike)
    .patch(verifyJwt, handleEditInteraction);

videoRouter.route("/:title/:limit/:lastId?").get(handleSearchVideos);