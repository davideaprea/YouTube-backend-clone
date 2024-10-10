import { Video } from "../video.type.js";

export type EditVideoDto = Partial<Pick<Video, "title" | "allowComments" | "description" | "chapters">>