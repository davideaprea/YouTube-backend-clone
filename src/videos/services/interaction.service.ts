import { UpdateQuery } from "mongoose";
import { HttpError } from "../../core/utilities/http-error.class";
import { transactionHandler } from "../../core/utilities/transaction-handler";
import { VideoLikeDislikeModel } from "../models/video-like-or-dislike.model";
import { VideoModel } from "../models/video.model";
import { findVideoById } from "./video.service";
import { Video } from "../types/video.type";

export const findInteraction = async (userId: string, videoId: string) => {
    const interaction = await VideoLikeDislikeModel.findOne({ userId, videoId });

    if (!interaction) throw new HttpError(404, "Interaction not found.");

    return interaction;
}

export const addInteraction = async (userId: string, videoId: string, liked: boolean) => {
    await transactionHandler(async session => {
        await VideoLikeDislikeModel.create(
            {
                liked,
                userId: userId,
                videoId: videoId
            },
            { session }
        );

        let operation: UpdateQuery<Video>;

        if (liked) operation = { $inc: { likes: 1 } };
        else operation = { $inc: { dislikes: 1 } };

        await VideoModel.updateOne({ _id: videoId }, operation, { session });
    });
}

export const toggleInteraction = async (userId: string, videoId: string) => {
    await transactionHandler(async session => {
        const interaction = await findInteraction(userId, videoId);

        interaction.liked = !interaction.liked;

        let operation: UpdateQuery<Video>;

        if (!interaction.liked) {
            operation = { $inc: { dislikes: 1, likes: -1 } };
        }
        else {
            operation = { $inc: { dislikes: -1, likes: 1 } };
        }

        await VideoModel.updateOne({ _id: videoId }, operation, { session });
        await interaction.save({ session });
    });
}

export const deleteInteraction = async (userId: string, videoId: string) => {
    await transactionHandler(async session => {
        const interaction = await findInteraction(userId, videoId);

        let operation: UpdateQuery<Video>;

        if (!interaction.liked) {
            operation = { $inc: { dislikes: -1 } };
        }
        else {
            operation = { $inc: { likes: -1 } };
        }

        await VideoModel.updateOne({ _id: videoId }, operation, { session });
        await VideoLikeDislikeModel.deleteOne({ _id: interaction._id }, { session });
    });
}