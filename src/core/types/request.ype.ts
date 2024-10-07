import { User } from "../../auth/types/user.type";

declare module "express-serve-static-core" {
    interface Request {
        user?: User;
    }
}