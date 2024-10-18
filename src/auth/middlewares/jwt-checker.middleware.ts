import { decodeJwt, getJwtFromReq } from "../services/jwt-manager.service";
import { HttpError } from "../../core/utilities/http-error.class";
import { UserModel } from "../models/user.model";
import { JwtPayload } from "jsonwebtoken";
import { CustomReqHandler } from "../../core/types/custom-req-handler.interface";

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

    req.appUser = user;

    next();
}