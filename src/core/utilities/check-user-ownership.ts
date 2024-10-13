import { Types } from "mongoose";
import { UserRelatedObj } from "../types/user-related-obj.type";
import { HttpError } from "./http-error.class";

export const checkUserOwnership = (userId: string | Types.ObjectId, resource: UserRelatedObj) => {
    const userIdString = userId.toString();
    const resourceOwnerId = resource.userId.toString();

    if(userIdString != resourceOwnerId) {
        throw new HttpError(403, "You're not the resource owner.");
    }
}