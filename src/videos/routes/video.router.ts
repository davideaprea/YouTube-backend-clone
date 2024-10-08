import { Router } from "express";
import { verifyJwt } from "../../auth/middlewares/jwt-checker.middleware";
import { multerConfig } from "../../core/constants/multer-config";
import { addView, createVideo, deleteVideo, editVideo, searchVideos } from "../controllers/video.controller";

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
    .patch(verifyJwt, editVideo);

videoRouter.route("/:id/view").patch(addView);

videoRouter.route("/:title/:limit/:lastId?").get(searchVideos);