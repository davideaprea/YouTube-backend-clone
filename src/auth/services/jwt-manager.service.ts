import { Request } from "express";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { User } from "../types/user.type";

export const generateBasicJwt = (claims: Record<string, any>): string => {
    return sign(
        claims,
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXP_TIME }
    );
}

export const generateAuthJwt = (user: User): string => {
    const { email, role } = user;
    return generateBasicJwt({ email, role });
}

export const decodeJwt = (token: string): JwtPayload | undefined => {
    try {
        return verify(token, process.env.JWT_SECRET!) as JwtPayload;
    }
    catch (e) {
        return;
    }
};

export const getJwtFromReq = (req: Request): string | undefined => {
    const authHeaders: string | undefined = req.headers.authorization;
    const token: string | undefined = authHeaders?.slice(7);

    if (authHeaders?.startsWith("Bearer") && token) {
        return token;
    }
}