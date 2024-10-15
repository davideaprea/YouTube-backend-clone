import { Document } from "mongoose";
import { Video } from "../video.type";

export type VideoDocument = Video & Document;