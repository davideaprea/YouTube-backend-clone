import { Router } from "express";
import { login, changePsw, register } from "../controllers/auth.controller.js";
import { verifyJwt } from "../middlewares/jwt-checker.middleware.js";

export const authRouter: Router = Router();

authRouter.route("/register").post(register);

authRouter.route("/login").post(login);

authRouter.route("/change-psw").patch(verifyJwt, changePsw);