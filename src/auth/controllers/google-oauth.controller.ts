import { CustomReqHandler } from "../../core/types/custom-req-handler.interface";
import { generateAuthJwt } from "../services/jwt-manager.service";
import { User } from "../types/user.type";

export const signWithGoogle: CustomReqHandler = (req, res) => {
    const user = req.user!;

    res.redirect("http://localhost:3000/v1/auth/google/success/" + generateAuthJwt(user as User));
}