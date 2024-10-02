import { Schema } from "mongoose";
import { AuthSchemaNames } from "../../auth/types/auth-schema-names.enum";
import { VideoSchemaNames } from "../types/video-schema-names.enum";

export const postIdProperty = {
    required: true,
    immutable: true,
    type: Schema.Types.ObjectId,
    ref: VideoSchemaNames.VIDEO
}

export const userIdProperty = {
    required: true,
    immutable: true,
    type: Schema.Types.ObjectId,
    ref: AuthSchemaNames.USER
}

export const timeProperty = {
    type: Date,
    default: new Date(),
    immutable: true
}