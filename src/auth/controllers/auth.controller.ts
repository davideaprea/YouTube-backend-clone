import { RequestHandler } from "express";
import { UserModel } from "../models/user.model";
import { decodeJwt, generateAuthJwt, getJwtFromReq } from "../services/jwt-manager.service";
import bcrypt, { compareSync } from 'bcrypt';
import { HttpError } from "../../core/utilities/http-error.class";
import { ChangePswDto } from "../types/change-psw-dto.type";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../types/user.type";
import { UserDocument } from "../types/user-document.type";
import { SignOptionsModel } from "../models/sign-options.model";
import { SignOptions } from "../types/sign-options.enum";
import { LoginDto } from "../types/login-dto.type";
import { CustomReqHandler } from "../../core/types/custom-req-handler.interface";

export const register: RequestHandler = async (req, res, next): Promise<void> => {
    req.body.signOption = (await SignOptionsModel.findOne({ option: SignOptions.STANDARD }))!._id;

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
        email: user.email,
        token: generateAuthJwt(user)
    });
};

export const login: RequestHandler = async (req, res, next): Promise<void> => {
    const credentials: LoginDto = req.body;

    if (!credentials.email || !credentials.password) {
        return next(new HttpError(400, "Email and password are required."));
    }

    const user: UserDocument | null = await UserModel.findOne({ email: credentials?.email });

    if (
        !user ||
        !bcrypt.compareSync(credentials.password, user.password)
    ) {
        return next(new HttpError(400, "Incorrect email or password."));
    }

    res
        .status(200)
        .header("Authorization", "Bearer " + generateAuthJwt(user))
        .json({
            username: user.email
        });
};

export const changePsw: RequestHandler = async (req, res, next): Promise<void> => {
    const { confirmNewPsw, currentPsw, newPsw } = req.body as ChangePswDto;

    if (newPsw != confirmNewPsw) {
        return next(new HttpError(401, "New password doesn't match with the confirmation password."));
    }

    const jwt: JwtPayload = decodeJwt(getJwtFromReq(req)!)!
    const user: UserDocument | null = await UserModel.findOne({ email: jwt.email });

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

export const signWithGoogle: CustomReqHandler = (req, res) => {
    const user = req.appUser!;

    res
        .status(200)
        .header("Authorization", "Bearer " + generateAuthJwt(user))
        .json({
            email: user.email
        });
}