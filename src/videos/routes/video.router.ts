import { Router } from "express";
import { verifyJwt } from "../../auth/middlewares/jwt-checker.middleware";

export const videoRouter: Router = Router();

videoRouter.route("/").post(verifyJwt);