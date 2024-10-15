import { ProjectionType } from "mongoose";
import { deleteFile, saveFile } from "../../core/services/media.service";
import { HttpError } from "../../core/utilities/http-error.class";
import { VideoModel } from "../models/video.model";
import { VideoDto } from "../types/dtos/video-dto.type";
import { Video } from "../types/video.type";
import { VideoLikeDislikeModel } from "../models/video-like-or-dislike.model";
import { EditVideoDto } from "../types/dtos/edit-video-dto.type";
import { transactionHandler } from "../../core/utilities/transaction-handler";
import { VideoDocument } from "../types/documents/video-document.type";

export const createVideo = async (dto: VideoDto): Promise<VideoDocument> => {
    /*TODO: Implement document and file deletion if creation fails.*/
    const { source, thumbnail, ...props } = dto;

    if (!source) throw new HttpError(400, "Video source file is missing.");

    let sourceName: string = await saveFile(source, "video"), thumbnailName: string | undefined;

    if (thumbnail) thumbnailName = await saveFile(thumbnail, "image");

    return await VideoModel.create({
        ...props,
        source: sourceName,
        thumbnail: thumbnailName
    });
}

export const findVideoById = async (id: string, projection?: ProjectionType<Video>): Promise<VideoDocument> => {
    const video: VideoDocument | null = await VideoModel.findById(id, projection).exec();

    if (!video) throw new HttpError(404, "Video not found.");

    return video;
}

export const deleteVideo = async (id: string, userId: string): Promise<void> => {
    await transactionHandler(async session => {
        const video: VideoDocument = await findVideoById(id, { _id: 1, source: 1, thumbnail: 1 });

        await VideoModel.deleteOne({ _id: id, creator: userId }, { session });
        await VideoLikeDislikeModel.deleteMany({ _id: id, userId }, { session });

        await deleteFile(video.source);
        if (video.thumbnail) await deleteFile(video.thumbnail);
    });
}

export const editVideo = async (id: string, userId: string, dto: EditVideoDto): Promise<void> => {
    const video: VideoDocument = await findVideoById(id);

    if(video.creator.toString() != userId) return;

    let thumbnailName: string | undefined;

    if (dto.thumbnail) {
        if (video.thumbnail) await deleteFile(video.thumbnail);

        thumbnailName = await saveFile(dto.thumbnail);
    }

    video.allowComments = dto.allowComments ?? video.allowComments;
    video.chapters = dto.chapters ?? video.chapters;
    video.title = dto.title ?? video.title;
    video.description = dto.description ?? video.description;
    video.thumbnail = thumbnailName;

    await video.save();
}

export const getVideoPage = async (title: string, limit: number = 10, lastId?: string): Promise<VideoDocument[]> => {
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