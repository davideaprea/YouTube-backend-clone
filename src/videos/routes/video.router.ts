import { Router } from "express";
import { verifyJwt } from "../../auth/middlewares/jwt-checker.middleware";
import { multerConfig } from "../../core/constants/multer-config";
import { handleAddInteraction, handleAddView, handleCreateVideo, handleDeleteVideo, handleEditVideo, handleRemoveInteraction, handleSearchVideos, handleEditInteraction, handleFindVideo } from "../controllers/video.controller";
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
    .get(handleFindVideo)
    .delete(verifyJwt, handleDeleteVideo)
    .patch(verifyJwt, handleEditVideo);

videoRouter.route("/:id/views").patch(handleAddView);

videoRouter.route("/:id/interactions/:interactionType").patch(verifyJwt, handleAddInteraction);

videoRouter.route("/:id/interactions")
    .delete(verifyJwt, handleRemoveInteraction)
    .patch(verifyJwt, handleEditInteraction);

videoRouter.route("/:title/:limit/:lastId?").get(handleSearchVideos);