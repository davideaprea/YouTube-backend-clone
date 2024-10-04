import { Schema } from "mongoose";
import { AuthSchemaNames } from "../../auth/types/auth-schema-names.enum";
import { VideoSchemaNames } from "../types/video-schema-names.enum";

export const videoIdProperty = {
    required: true,
    immutable: true,
    type: Schema.Types.ObjectId,
    ref: VideoSchemaNames.VIDEO
} as const;

export const userIdProperty = {
    required: true,
    immutable: true,
    type: Schema.Types.ObjectId,
    ref: AuthSchemaNames.USER
} as const;

export const timeProperty = {
    type: Date,
    default: new Date(),
    immutable: true
} as const;