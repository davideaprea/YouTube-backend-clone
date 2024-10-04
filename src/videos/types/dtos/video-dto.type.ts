import { Video } from "../video.type";

export type VideoDto = Pick<Video, "creatorId" | "title" | "description" | "allowComments" | "chapters"> & {
    source: Express.Multer.File,
    thumbnail: Express.Multer.File
};