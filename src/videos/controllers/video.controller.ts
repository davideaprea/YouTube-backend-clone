import { RequestHandler } from "express"
import { VideoDto } from "../types/dtos/video-dto.type"
import { HttpError } from "../../core/utilities/http-error.class";
import { deleteFile, saveFile } from "../../core/services/media.service";
import { VideoModel } from "../models/video.model";
import { MulterFileMap } from "../../core/types/multer-file-map.type";
import { CustomReqHandler } from "../../core/types/custom-req-handler.interface";

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

export const deleteVideo: CustomReqHandler = async (req, res, next): Promise<void> => {
    const videoId: string = req.params.id;
    const video = await VideoModel.findById(
        videoId,
        {
            _id: 1,
            creatorId: 1,
            source: 1
        }
    ).exec();

    if (!video) {
        return next(new HttpError(404));
    }

    if (!video.creatorId.equals(req.user!._id)) {
        return next(new HttpError(403, "You're not the creator of this video."));
    }

    try {
        await VideoModel.deleteOne({ _id: videoId });
        await deleteFile(video.source);
        res.status(204).send();
    } catch (e) {
        next(e);
    }
}