import { Router } from "express";
import { verifyJwt } from "../../auth/middlewares/jwt-checker.middleware";
import { multerConfig } from "../../core/constants/multer-config";

export const videoRouter: Router = Router();

videoRouter.route("/").post(
    verifyJwt,
    multerConfig.fields([
        { name: "source", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ])
);