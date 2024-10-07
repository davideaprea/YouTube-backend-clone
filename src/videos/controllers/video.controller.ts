import { RequestHandler } from "express"
import { VideoDto } from "../types/dtos/video-dto.type"
import { HttpError } from "../../core/utilities/http-error.class";
import { saveFile } from "../../core/services/media.service";
import { VideoModel } from "../models/video.model";
import { MulterFileMap } from "../../core/types/multer-file-map.type";

export const createVideo: RequestHandler = async (req, res, next): Promise<void> => {
    const dto: VideoDto = req.body;
    const files = req.files as MulterFileMap | undefined;
    const sourceFile = files?.source?.[0];
    const thumbnailFile = files?.thumbnail?.[0];

    if (!sourceFile) return next(new HttpError(400, "Missing video source."));

    try {
        let sourceName = await saveFile(sourceFile, "video"), thumbnailName;

        if (thumbnailFile) thumbnailName = await saveFile(thumbnailFile, "image");

        dto.source = sourceName!;
        dto.thumbnail = thumbnailName;

        const video = await VideoModel.create(dto);
        res.status(201).json(video);
    } catch (e) {
        next(e);
    }
}