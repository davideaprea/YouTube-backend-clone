import { Router } from "express";
import { changePsw, login, register } from "../controllers/auth.controller";
import { verifyJwt } from "../middlewares/jwt-checker.middleware";

export const authRouter: Router = Router();

authRouter.route("/register").post(register);

authRouter.route("/login").post(login);

authRouter.route("/change-psw").patch(verifyJwt, changePsw);