import { Video } from "../video.type";

export type EditVideoDto = Partial<Pick<Video, "title" | "allowComments" | "description" | "chapters">> & {
    thumbnail: Express.Multer.File
};