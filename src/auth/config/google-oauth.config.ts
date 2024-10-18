import passport from "passport";
import { Strategy } from "passport-google-oauth20";

passport.use(new Strategy(
    {
        callbackURL: "http://localhost:3000/v1/auth/google/redirect",
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    },
    (accToken, refreshToken, profile, done) => {
        console.log(accToken);
        console.log(profile);
        done(null, profile);
    }
));