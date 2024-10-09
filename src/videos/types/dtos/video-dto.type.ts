import { Types } from "mongoose";
import { Video } from "../video.type";

export type VideoDto = Pick<Video, "title" | "description" | "allowComments" | "chapters"> & {
    creator: Types.ObjectId,
    source: Express.Multer.File,
    thumbnail?: Express.Multer.File,
};