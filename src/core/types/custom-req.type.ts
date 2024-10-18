import { Request } from "express";
import { User } from "../../auth/types/user.type";

export type CustomReq = Request & {
    expressUser?: Express.User,
    appUser?: User
}