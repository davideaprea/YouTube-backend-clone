import { RequestHandler } from "express";
import { JwtPayload } from "jsonwebtoken";
import { decodeJwt, getJwtFromReq } from "../services/jwt-manager.service";
import { Roles } from "../types/roles.enum";
import { HttpError } from "../../core/utilities/http-error.class";

export const isAuhorized = (role: Roles) => {
    const reqHandler: RequestHandler = (req, res, next): void => {
        const jwt: JwtPayload  = decodeJwt(getJwtFromReq(req)!)!
        
        if(jwt.role != role) return next(new HttpError(403));

        next();
    }

    return reqHandler;
}