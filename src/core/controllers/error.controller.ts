import { HttpError } from "../utilities/http-error.class";
import mongoose from "mongoose";

export const globalErrorHandler = (err: unknown, req: any, res: any, next: any): void => {
    console.log(err);
    if (err instanceof HttpError) {
        res
            .status(err.status)
            .send(err.message);
    }
    else if (err instanceof mongoose.Error.ValidationError) {
        res
            .status(400)
            .send(Object.values(err.errors).map(err => err.message));
    }
    else {
        res
            .status(500)
            .send(err);
    }
}