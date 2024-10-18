import { config } from 'dotenv';
config({ path: "./.env" });

import express, { Express, json } from 'express';
import { authRouter } from './auth/routes/auth.router';
import { globalErrorHandler } from './core/controllers/error.controller';
import { HttpError } from './core/utilities/http-error.class';
import cors from 'cors';
import { videoRouter } from './videos/routes/video.router';
import { commentRouter } from './videos/routes/comment.router';
import rateLimit from 'express-rate-limit';
import sanitize from 'express-mongo-sanitize'
import helmet from 'helmet';
import hpp from "hpp";
import passport from 'passport';

export const app: Express = express();

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'none'"],
            "script-src": ["'none'"],
            "style-src": ["'none'"],
            "img-src": ["'none'"],
            "connect-src": ["'self'"],
            "object-src": ["'none'"]
        }
    },
    frameguard: {
        action: "deny"
    }
}));

app.use(hpp());

app.use(cors());

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 75,
    standardHeaders: true,
    legacyHeaders: false
}));

app.use(json());

app.use(sanitize());

app.use(passport.initialize());

app.use("/v1/auth", authRouter);

app.use("/v1/videos", videoRouter);

app.use("/v1/comments", commentRouter);

app.use(globalErrorHandler);

app.all("*", (req, res, next) => {
    next(new HttpError(404));
});