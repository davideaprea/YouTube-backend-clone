import { HttpError } from "../../core/utilities/http-error.class";
import { VideoLikeDislikeModel } from "../models/video-like-or-dislike.model";
import { findVideoById } from "./video.service";

export const findInteraction = async (userId: string, videoId: string) => {
    const interaction = await VideoLikeDislikeModel.findOne({ userId, videoId });

    if (!interaction) throw new HttpError(404, "Interaction not found.");

    return interaction;
}

export const addInteraction = async (userId: string, videoId: string, liked: boolean) => {
    const video = await findVideoById(videoId);

    await VideoLikeDislikeModel.create({
        liked,
        userId: userId,
        videoId: videoId
    });

    if (liked) video.likes++;
    else video.dislikes++;

    await video.save();
}

export const toggleInteraction = async (userId: string, videoId: string) => {
    const interaction = await findInteraction(userId, videoId);

    const video = await findVideoById(videoId);

    interaction.liked = !interaction.liked;

    if (!interaction.liked) {
        video.dislikes++;
        video.likes--;
    }
    else {
        video.dislikes--;
        video.likes++;
    }

    await video.save();
    await interaction.save();
}