import { ProjectionType } from "mongoose";
import { deleteFile, saveFile } from "../../core/services/media.service";
import { HttpError } from "../../core/utilities/http-error.class";
import { VideoModel } from "../models/video.model";
import { VideoDto } from "../types/dtos/video-dto.type";
import { Video } from "../types/video.type";
import { VideoLikeDislikeModel } from "../models/video-like-or-dislike.model";

export const createVideo = async (dto: VideoDto): Promise<any> => {
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

export const findVideoById = async (id: string, projection?: ProjectionType<Video>): Promise<any> => {
    const video = await VideoModel.findById(id, projection).exec();

    if (!video) throw new HttpError(404, "Video not found.");

    return video;
}

export const deleteVideo = async (video: Video): Promise<void> => {
    await VideoModel.deleteOne({ _id: video._id });
    await VideoLikeDislikeModel.deleteMany({ _id: video._id });
    await deleteFile(video.source);
}