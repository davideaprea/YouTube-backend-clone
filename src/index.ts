import { config } from 'dotenv';
config({ path: "./.env" });

import express, { Express, json } from 'express';
import cors from 'cors';
import { authRouter } from './auth/routes/auth.router.js';
import { globalErrorHandler } from './core/controllers/error.controller.js';
import { HttpError } from './core/utilities/http-error.class.js';
import { videoRouter } from './videos/routes/video.router.js';


export const app: Express = express();

app.use(cors());
app.use(json());

app.use("/v1/auth", authRouter);

app.use("/v1/videos", videoRouter);

app.use(globalErrorHandler);

app.all("*", (req, res, next) => {
    next(new HttpError(404));
});