import { RequestHandler } from "express";
import { MulterFileMap } from "../types/multer-file-map.type";

export const addFilesToBody: RequestHandler = (req, res, next): void => {
    const files = req.files as MulterFileMap | undefined;

    for (const key in files) {
        req.body[key] = files[key][0];
    }

    next();
}