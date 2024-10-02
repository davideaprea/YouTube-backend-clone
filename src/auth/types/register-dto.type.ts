import { Roles } from "./roles.enum"

export type RegisterDto = {
    name?: string,
    surname?: string,
    email: string,
    password: string,
    role: Roles
}