import { RegisterDto } from "./register-dto.type"

export type User = RegisterDto & {
    readonly _id: number,
    readonly createdAt: Date
};