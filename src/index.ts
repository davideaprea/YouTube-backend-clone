import express, { Express, json } from 'express';
import { authRouter } from './auth/routes/auth.router';
import { globalErrorHandler } from './core/controllers/error.controller';
import { HttpError } from './core/utilities/http-error.class';
import cors from 'cors';
import { config } from 'dotenv';
import { videoRouter } from './videos/routes/video.router';

config({ path: "./.env" });

export const app: Express = express();

app.use(cors());
app.use(json());

app.use("/v1/auth", authRouter);

app.use("v1/videos", videoRouter);

app.use(globalErrorHandler);

app.all("*", (req, res, next) => {
    next(new HttpError(404));
});