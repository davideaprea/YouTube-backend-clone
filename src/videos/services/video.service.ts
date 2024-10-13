import { ProjectionType } from "mongoose";
import { deleteFile, saveFile } from "../../core/services/media.service";
import { HttpError } from "../../core/utilities/http-error.class";
import { VideoModel } from "../models/video.model";
import { VideoDto } from "../types/dtos/video-dto.type";
import { Video } from "../types/video.type";
import { VideoLikeDislikeModel } from "../models/video-like-or-dislike.model";
import { EditVideoDto } from "../types/dtos/edit-video-dto.type";
import { transactionHandler } from "../../core/utilities/transaction-handler";

export const createVideo = async (dto: VideoDto) => {
    /*TODO: Implement document and file deletion if creation fails.*/
    const { source, thumbnail, ...props } = dto;

    if (!source) throw new HttpError(400, "Video source file is missing.");

    let sourceName = await saveFile(source, "video"), thumbnailName;

    if (thumbnail) thumbnailName = await saveFile(thumbnail, "image");

    return await VideoModel.create({
        ...props,
        source: sourceName,
        thumbnail: thumbnailName
    });
}

export const findVideoById = async (id: string, projection?: ProjectionType<Video>) => {
    const video = await VideoModel.findById(id, projection).exec();

    if (!video) throw new HttpError(404, "Video not found.");

    return video;
}

export const deleteVideo = async (id: string) => {
    /*TODO: Find a way to check if the user
    is actually the owner of this resource.*/
    await transactionHandler(async () => {
        const video = await findVideoById(id, { _id: 1, source: 1, thumbnail: 1 });

        await VideoModel.deleteOne({ _id: id });
        await VideoLikeDislikeModel.deleteMany({ _id: id });

        await deleteFile(video.source);
        if (video.thumbnail) await deleteFile(video.thumbnail);
    });
}

export const editVideo = async (id: string, dto: EditVideoDto) => {
    const video = await findVideoById(id);

    video.allowComments = dto.allowComments ?? video.allowComments;
    video.chapters = dto.chapters ?? video.chapters;
    video.title = dto.title ?? video.title;
    video.description = dto.description ?? video.description;

    await video.save();
}

export const getVideoPage = async (title: string, limit: number = 10, lastId?: string) => {
    const query: Record<string, any> = { $text: { $search: title } };

    if (lastId) query._id = { $gt: lastId };
    if (limit > 50 || limit <= 0) limit = 10;

    return await VideoModel
        .find(query, {
            _id: 1,
            creator: 1,
            createdAt: 1,
            thumbnail: 1,
            views: 1,
            title: 1
        })
        .populate("creator", "name surname profilePic")
        .sort({ _id: 1 })
        .limit(limit);
}

export const addView = async (id: string) => {
    const video = await findVideoById(id);

    video.views++;

    video.save();
}