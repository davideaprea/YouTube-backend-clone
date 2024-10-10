import { RequestHandler } from "express";
import { JwtPayload } from "jsonwebtoken";
import { HttpError } from "../../core/utilities/http-error.class.js";
import { decodeJwt, getJwtFromReq } from "../services/jwt-manager.service.js";
import { Roles } from "../types/roles.enum.js";

export const isAuhorized = (role: Roles) => {
    const reqHandler: RequestHandler = (req, res, next): void => {
        const jwt: JwtPayload  = decodeJwt(getJwtFromReq(req)!)!
        
        if(jwt.role != role) return next(new HttpError(403));

        next();
    }

    return reqHandler;
}