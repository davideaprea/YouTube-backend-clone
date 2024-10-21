import { Router } from "express";
import { changePsw, login, register } from "../controllers/auth.controller";
import { verifyJwt } from "../middlewares/jwt-checker.middleware";
import passport from "passport";
import { googleStrategyInit } from "../config/google-oauth.config";
import { signWithGoogle } from "../controllers/google-oauth.controller";

googleStrategyInit();

export const authRouter: Router = Router();

authRouter.route("/register").post(register);

authRouter.route("/login").post(login);

authRouter.route("/change-psw").patch(verifyJwt, changePsw);

authRouter.route("/google").get(
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

authRouter.route("/google/redirect").get(
    passport.authenticate("google", {
        session: false,
        failureRedirect: "http://localhost:3000/v1/auth/google/error"
    }),
    signWithGoogle
);

authRouter.route("/google/success/:jwt").get(
    (req, res) => {
        res.send("Success!");
    }
);

authRouter.route("/google/error").get(
    (req, res) => {
        res.send("Error!");
    }
);