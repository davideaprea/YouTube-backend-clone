import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { UserModel } from "../models/user.model";
import { Roles } from "../types/roles.enum";
import { SignOptionsModel } from "../models/sign-options.model";
import { SignOptions } from "../types/sign-options.enum";

passport.use(new Strategy(
    {
        callbackURL: "http://localhost:3000/v1/auth/google/redirect",
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    },
    async (accToken, refreshToken, profile, done) => {
        console.log(profile);

        const userData = profile._json;
        const existingUser = await UserModel.findOne({ email: userData.email });

        if (existingUser) {
            return done(null, existingUser);
        }

        const user = {
            email: userData.email!,
            username: userData.name!.toLowerCase().replaceAll(" ", "_") + Date.now(),
            role: Roles.USER,
            signOption: (await SignOptionsModel.findOne({ option: SignOptions.GOOGLE }))!._id
        };

        const newUser = await UserModel.create(user);

        return done(null, { appUser: newUser });
    }
));