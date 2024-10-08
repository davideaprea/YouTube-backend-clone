import { VideoDto } from "../types/dtos/video-dto.type"
import { HttpError } from "../../core/utilities/http-error.class";
import { deleteFile, saveFile } from "../../core/services/media.service";
import { VideoModel } from "../models/video.model";
import { MulterFileMap } from "../../core/types/multer-file-map.type";
import { CustomReqHandler } from "../../core/types/custom-req-handler.interface";
import { EditVideoDto } from "../types/dtos/edit-video-dto.type";

export const createVideo: CustomReqHandler = async (req, res, next): Promise<void> => {
    const dto: VideoDto = req.body;
    const files = req.files as MulterFileMap | undefined;
    const sourceFile = files?.source?.[0];
    const thumbnailFile = files?.thumbnail?.[0];

    if (!sourceFile) return next(new HttpError(400, "Missing video source."));

    try {
        let sourceName = await saveFile(sourceFile, "video"), thumbnailName;

        if (thumbnailFile) thumbnailName = await saveFile(thumbnailFile, "image");

        dto.creatorId = req.user!._id;
        dto.source = sourceName!;
        dto.thumbnail = thumbnailName;

        const video = await VideoModel.create(dto);
        res.status(201).json(video);
        /*TODO: Implement document and file deletion
        if creation fails.*/
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

export const editVideo: CustomReqHandler = async (req, res, next): Promise<void> => {
    const videoId: string = req.params.id;
    const body: EditVideoDto = req.body;
    const video = await VideoModel.findById(videoId).exec();

    if (!video) {
        return next(new HttpError(404));
    }

    /*TODO: Find a way to remove this duplicate code to
    check if the user is actually the owner of this resource.*/
    if (!video.creatorId.equals(req.user!._id)) {
        return next(new HttpError(403, "You're not the creator of this video."));
    }

    video.allowComments = body.allowComments ?? video.allowComments;
    video.chapters = body.chapters ?? video.chapters;
    video.title = body.title ?? video.title;
    video.description = body.description ?? video.description;

    try {
        await video.save();
        res.status(204).send();
    } catch (e) {
        next(e);
    }
}

export const searchVideos: CustomReqHandler = async (req, res, next): Promise<void> => {
    const lastId: string | undefined = req.params.lastId;
    const title: string | undefined = req.params.title.replaceAll("+", " ");
    const query: Record<string, any> = { $text: { $search: title } };

    if (lastId) {
        query._id = { $gt: lastId };
    }

    let limit: number | undefined = Number(req.params.limit) || 10;

    if (limit > 50) limit = 10;

    const results = await VideoModel
        .find(query, {
            _id: 1,
            creatorId: 1,
            createdAt: 1,
            thumbnail: 1,
            views: 1,
            title: 1
        })
        .sort({ _id: 1 })
        .limit(limit);

    res.status(200).json(results);
}