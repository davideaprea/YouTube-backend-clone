import { Request } from "express";
import { User } from "../../auth/types/user.type.js";

export type CustomReq = Request & {
    user?: User
}