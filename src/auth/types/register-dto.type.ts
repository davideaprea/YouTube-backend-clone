import { Roles } from "./roles.enum"

export type RegisterDto = {
    name?: string,
    surname?: string,
    email: string,
    password: string,
    username: string,
    role: Roles,
    birthday?: Date,
    country?: string,
    description?: string,
    profilePic?: string
}