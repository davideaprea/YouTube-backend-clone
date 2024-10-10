import { VideoDto } from "../types/dtos/video-dto.type"
import { HttpError } from "../../core/utilities/http-error.class";
import { VideoModel } from "../models/video.model";
import { CustomReqHandler } from "../../core/types/custom-req-handler.interface";
import { EditVideoDto } from "../types/dtos/edit-video-dto.type";
import { User } from "../../auth/types/user.type";
import { VideoLikeDislikeModel } from "../models/video-like-or-dislike.model";
import { InteractionType } from "../types/interaction-type.enum";
import { createVideo, deleteVideo, editVideo, findVideoById, getVideoPage } from "../services/video.service";

export const handleCreateVideo: CustomReqHandler = async (req, res, next): Promise<void> => {
    try {
        const dto: VideoDto = req.body;

        dto.creator = req.user!._id;

        const video = await createVideo(dto);
        res.status(201).json(video);
    } catch (e) {
        next(e);
    }
}

export const handleDeleteVideo: CustomReqHandler = async (req, res, next): Promise<void> => {
    try {
        const videoId: string = req.params.id;
        const video = await findVideoById(
            videoId,
            {
                _id: 1,
                creator: 1,
                source: 1
            }
        );

        if (!video.creator.equals(req.user!._id)) {
            return next(new HttpError(403, "You're not the creator of this video."));
        }

        await deleteVideo(video);
        res.status(204).send();
    } catch (e) {
        next(e);
    }
}

export const handleEditVideo: CustomReqHandler = async (req, res, next): Promise<void> => {
    try {
        await editVideo(req.params.id, req.body);
        res.status(204).send();
    } catch (e) {
        next(e);
    }
}

export const handleSearchVideos: CustomReqHandler = async (req, res, next): Promise<void> => {
    const lastId: string | undefined = req.params.lastId;
    const title: string = req.params.title.replaceAll("+", " ");
    const limit: number = Number(req.params.limit);
    
    const results = await getVideoPage(title, limit, lastId);

    res.status(200).json(results);
}

export const addView: CustomReqHandler = async (req, res, next): Promise<void> => {
    const id: string = req.params.id;

    const video = await VideoModel.findById(id, { views: 1 }).exec();

    if (!video) {
        return next(new HttpError(404));
    }

    video.views++;

    try {
        await video.save();
        res.status(204).send();
    } catch (e) {
        next(e);
    }
}

export const addLikeDislike: CustomReqHandler = async (req, res, next): Promise<void> => {
    const action: string = req.params.interaction;

    if (!(action in InteractionType)) {
        return next(new HttpError(400, `Please, send a correct interaction between ${InteractionType.LIKE} or ${InteractionType.DISLIKE}`));
    }

    const liked: boolean = action == InteractionType.LIKE ? true : false;
    const id: string = req.params.id;
    const user: User = req.user!;
    const video = await VideoModel
        .findById(id, { likes: 1, dislikes: 1 })
        .exec();

    if (!video) {
        return next(new HttpError(404, "Video not found."));
    }

    const likeDislike = await VideoLikeDislikeModel
        .findOne(
            { userId: user._id, videoId: id },
            { liked: 1 }
        );

    try {
        if (likeDislike) {
            if (likeDislike.liked != liked) {
                likeDislike.liked = liked;

                if (!liked) {
                    video.dislikes++;
                    video.likes--;
                }
                else {
                    video.dislikes--;
                    video.likes++;
                }

                await video.save();
                await likeDislike.save();
            }
        }
        else {
            await VideoLikeDislikeModel.create({
                liked,
                userId: user._id,
                videoId: id
            });

            if (liked) video.likes++;
            else video.dislikes--;

            await video.save();
        }

        res.status(204).send();
    } catch (e) {
        next(e);
    }
}

export const removeLikeDislike: CustomReqHandler = async (req, res, next): Promise<void> => {
    const id: string = req.params.id;

    const video = await VideoModel.findById(id, { likes: 1, dislikes: 1 }).exec();

    if (!video) {
        return next(new HttpError(404, "Video not found."));
    }

    const likeDislike = await VideoLikeDislikeModel
        .findOne(
            { userId: req.user!._id, videoId: id },
            { liked: 1 }
        );

    if (!likeDislike) {
        return next(new HttpError(404, "Interaction not found."));
    }

    if (likeDislike.liked) video.likes--;
    else video.dislikes--;

    try {
        await video.save();
        await VideoLikeDislikeModel.deleteOne({ _id: likeDislike._id });

        res.status(204).send();
    } catch (e) {
        next(e);
    }
}