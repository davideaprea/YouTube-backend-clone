import { Request } from "express";
import { User } from "../../auth/types/user.type";

export type CustomReq = Request & {
    user?: User
}