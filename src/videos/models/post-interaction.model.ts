import { model, Schema } from "mongoose";
import { VideoSchemaNames } from "../types/video-schema-names.enum";
import { PostInteraction } from "../types/post-interaction.type";
import { userIdProperty, postIdProperty, timeProperty } from "../constants/post-interaction.property";

const postInteraction = new Schema<PostInteraction>({
    userId: { ...userIdProperty },
    postId: { ...postIdProperty },
    time: { ...timeProperty }
});

postInteraction.index({ postId: 1, userId: 1 }, { unique: true });

export const LikeModel = model(VideoSchemaNames.LIKE, postInteraction);
export const DislikeModel = model(VideoSchemaNames.DISLIKE, postInteraction);