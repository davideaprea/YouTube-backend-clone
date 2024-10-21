import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { UserModel } from "../models/user.model";
import { Roles } from "../types/roles.enum";
import { SignOptionsModel } from "../models/sign-options.model";
import { SignOptions } from "../types/sign-options.enum";

export const googleStrategyInit = () => {
    passport.use(new Strategy(
        {
            callbackURL: "http://localhost:3000/v1/auth/google/redirect",
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        },
        async (accToken, refreshToken, profile, done) => {
            const userData = profile._json;
            let user = await UserModel.findOne({ email: userData.email });

            if (!user) {
                const userDto = {
                    email: userData.email!,
                    username: userData.name!.toLowerCase().replaceAll(" ", "_") + Date.now(),
                    role: Roles.USER,
                    signOption: (await SignOptionsModel.findOne({ option: SignOptions.GOOGLE }))!._id
                };

                user = await UserModel.create(userDto);
            }

            return done(null, user);
        }
    ));
}