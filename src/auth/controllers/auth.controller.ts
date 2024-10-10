import { compareSync } from "bcrypt";
import { RequestHandler } from "express";
import { JwtPayload } from "jsonwebtoken";
import { HttpError } from "../../core/utilities/http-error.class.js";
import { UserModel } from "../models/user.model.js";
import { generateAuthJwt, decodeJwt, getJwtFromReq } from "../services/jwt-manager.service.js";
import { ChangePswDto } from "../types/change-psw-dto.type.js";
import { User } from "../types/user.type.js";


export const register: RequestHandler = async (req, res, next): Promise<void> => {
    const { email } = req.body;

    let user: User;

    try {
        user = await UserModel.create(req.body);
    } catch (e) {
        const keys = (e as any)?.errorResponse?.keyValue;

        if (keys?.email) {
            return next(new HttpError(400, "This email is already taken."));
        }

        if (keys?.username) {
            return next(new HttpError(400, "This username is already taken."));
        }

        return next(e);
    }

    res.status(201).json({
        email: email,
        token: generateAuthJwt(user)
    });
};

export const login: RequestHandler = async (req, res, next): Promise<void> => {
    const credentials = req.body;
    const user = await UserModel.findOne({ email: credentials?.email });

    if (!user || !compareSync(credentials.password, user.password)) {
        return next(new HttpError(400, "Incorrect email or password."));
    }

    res.status(200).json({
        username: user.email,
        token: generateAuthJwt(user)
    });
};

export const changePsw: RequestHandler = async (req, res, next): Promise<void> => {
    const {confirmNewPsw, currentPsw, newPsw} = req.body as ChangePswDto;

    if (newPsw != confirmNewPsw) {
        return next(new HttpError(401, "New password doesn't match with the confirmation password."));
    }

    const jwt: JwtPayload = decodeJwt(getJwtFromReq(req)!)!
    const user = await UserModel.findOne({ email: jwt.email });

    if (!user) return next(new HttpError(401, "Couldn't find user with this email."));

    if (!compareSync(currentPsw, user.password)) {
        return next(new HttpError(401, "Old password doesn't match with the current password."));
    }

    user.password = newPsw;

    try {
        await user.save();
    }
    catch (e) {
        return next(e);
    }

    res.status(200).send("Password changed successfully.");
}