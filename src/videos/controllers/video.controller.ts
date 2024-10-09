import { VideoDto } from "../types/dtos/video-dto.type"
import { HttpError } from "../../core/utilities/http-error.class";
import { deleteFile } from "../../core/services/media.service";
import { VideoModel } from "../models/video.model";
import { CustomReqHandler } from "../../core/types/custom-req-handler.interface";
import { EditVideoDto } from "../types/dtos/edit-video-dto.type";
import { User } from "../../auth/types/user.type";
import { VideoLikeDislikeModel } from "../models/video-like-or-dislike.model";
import { InteractionType } from "../types/interaction-type.enum";
import { createVideo } from "../services/video.service";

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

export const deleteVideo: CustomReqHandler = async (req, res, next): Promise<void> => {
    const videoId: string = req.params.id;
    const video = await VideoModel.findById(
        videoId,
        {
            _id: 1,
            creator: 1,
            source: 1
        }
    ).exec();

    if (!video) {
        return next(new HttpError(404));
    }

    if (!video.creator.equals(req.user!._id)) {
        return next(new HttpError(403, "You're not the creator of this video."));
    }

    try {
        await VideoModel.deleteOne({ _id: videoId });
        await VideoLikeDislikeModel.deleteMany({ videoId });
        await deleteFile(video.source);
        res.status(204).send();
    } catch (e) {
        next(e);
    }
}

export const editVideo: CustomReqHandler = async (req, res, next): Promise<void> => {
    const videoId: string = req.params.id;
    const body: EditVideoDto = req.body;
    const video = await VideoModel.findById(videoId).exec();

    if (!video) {
        return next(new HttpError(404));
    }

    /*TODO: Find a way to remove this duplicate code to
    check if the user is actually the owner of this resource.*/
    if (!video.creator.equals(req.user!._id)) {
        return next(new HttpError(403, "You're not the creator of this video."));
    }

    video.allowComments = body.allowComments ?? video.allowComments;
    video.chapters = body.chapters ?? video.chapters;
    video.title = body.title ?? video.title;
    video.description = body.description ?? video.description;

    try {
        await video.save();
        res.status(204).send();
    } catch (e) {
        next(e);
    }
}

export const searchVideos: CustomReqHandler = async (req, res, next): Promise<void> => {
    const lastId: string | undefined = req.params.lastId;
    const title: string | undefined = req.params.title.replaceAll("+", " ");
    const query: Record<string, any> = { $text: { $search: title } };

    if (lastId) {
        query._id = { $gt: lastId };
    }

    let limit: number | undefined = Number(req.params.limit) || 10;

    if (limit > 50) limit = 10;

    const results = await VideoModel
        .find(query, {
            _id: 1,
            creator: 1,
            createdAt: 1,
            thumbnail: 1,
            views: 1,
            title: 1
        })
        .populate("creator", "name surname profilePic")
        .sort({ _id: 1 })
        .limit(limit);

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