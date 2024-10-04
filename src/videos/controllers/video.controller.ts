import { RequestHandler } from "express"
import { VideoDto } from "../types/dtos/video-dto.type"

export const createVideo: RequestHandler = (req, res, next) => {
    const dto: VideoDto = req.body;
}