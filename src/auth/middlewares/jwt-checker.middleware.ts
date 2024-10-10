import { JwtPayload } from "jsonwebtoken";
import { CustomReqHandler } from "../../core/types/custom-req-handler.interface.js";
import { HttpError } from "../../core/utilities/http-error.class.js";
import { UserModel } from "../models/user.model.js";
import { getJwtFromReq, decodeJwt } from "../services/jwt-manager.service.js";


export const verifyJwt: CustomReqHandler = async (req, res, next): Promise<void> => {
    const token: string | undefined = getJwtFromReq(req);

    if (!token) {
        return next(new HttpError(401));
    }

    const jwt: JwtPayload | undefined = decodeJwt(token);

    if (!jwt) {
        return next(new HttpError(401));
    }

    const user = await UserModel.findOne({ email: jwt.email });

    if (!user) {
        return next(new HttpError(401));
    }

    req.user = user;

    next();
}