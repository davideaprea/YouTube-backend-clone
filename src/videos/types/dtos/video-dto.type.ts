import { Types } from "mongoose";
import { Video } from "../video.type";

export type VideoDto = Pick<Video, "title" | "description" | "allowComments" | "chapters" | "source" | "thumbnail"> & {
    creatorId: Types.ObjectId
};