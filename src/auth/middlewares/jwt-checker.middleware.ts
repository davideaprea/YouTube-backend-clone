import { RequestHandler } from "express";
import { decodeJwt, getJwtFromReq } from "../services/jwt-manager.service";
import { HttpError } from "../../core/utilities/http-error.class";
import { UserModel } from "../models/user.model";
import { JwtPayload } from "jsonwebtoken";

export const verifyJwt: RequestHandler = async (req, res, next): Promise<void> => {
    const token: string | undefined = getJwtFromReq(req);

    if (!token) {
        return next(new HttpError(401));
    }

    const jwt: JwtPayload | undefined = decodeJwt(token);

    if (!jwt || !(await UserModel.find({ email: jwt.email }))) {
        return next(new HttpError(401));
    }

    next();
}