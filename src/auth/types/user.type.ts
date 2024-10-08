import { Types } from "mongoose";
import { RegisterDto } from "./register-dto.type"

export type User = RegisterDto & {
    readonly _id: Types.ObjectId,
    readonly createdAt: Date
};