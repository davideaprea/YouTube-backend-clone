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

export const app: Express = express();

app.use(cors());

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 75,
    standardHeaders: true,
    legacyHeaders: false
}));

app.use(json());

app.use(sanitize());

app.use("/v1/auth", authRouter);

app.use("/v1/videos", videoRouter);

app.use("/v1/comments", commentRouter);

app.use(globalErrorHandler);

app.all("*", (req, res, next) => {
    next(new HttpError(404));
});