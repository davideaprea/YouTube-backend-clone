import { saveFile } from "../../core/services/media.service";
import { HttpError } from "../../core/utilities/http-error.class";
import { VideoModel } from "../models/video.model";
import { VideoDto } from "../types/dtos/video-dto.type";

export const createVideo = async (dto: VideoDto): Promise<any> => {
    /*TODO: Implement document and file deletion if creation fails.*/
    const { source, thumbnail, ...props } = dto;

    if(!source) throw new HttpError(400, "Video source file is missing.");

    let sourceName = await saveFile(source, "video"), thumbnailName;

    if (thumbnail) thumbnailName = await saveFile(thumbnail, "image");

    return await VideoModel.create({
        ...props,
        source: sourceName,
        thumbnail: thumbnailName
    });
}