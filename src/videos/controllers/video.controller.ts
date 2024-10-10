import { VideoDto } from "../types/dtos/video-dto.type"
import { HttpError } from "../../core/utilities/http-error.class";
import { CustomReqHandler } from "../../core/types/custom-req-handler.interface";
import { User } from "../../auth/types/user.type";
import { InteractionType } from "../types/interaction-type.enum";
import { addView, createVideo, deleteVideo, editVideo, findVideoById, getVideoPage } from "../services/video.service";
import { addInteraction, deleteInteraction, toggleInteraction } from "../services/interaction.service";
import { getOrSetCache } from "../../core/services/cache.service";

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

export const handleAddView: CustomReqHandler = async (req, res, next): Promise<void> => {
    const id: string = req.params.id;

    try {
        await addView(id);
        res.status(204).send();
    } catch (e) {
        next(e);
    }
}

export const handleFindVideo: CustomReqHandler = async (req, res, next): Promise<void> => {
    try {
        const id: string = req.params.id;
        const video = await getOrSetCache(
            "videos/" + id,
            async () => await findVideoById(id),
            3600
        );
        
        res.status(200).json(video);
    } catch (e) {
        next(e);
    }
}

export const handleAddInteraction: CustomReqHandler = async (req, res, next): Promise<void> => {
    const action: string = req.params.interactionType;

    if (!(action in InteractionType)) {
        return next(new HttpError(400, `Please, send a correct interaction between ${InteractionType.LIKE} or ${InteractionType.DISLIKE}`));
    }

    const liked: boolean = action == InteractionType.LIKE ? true : false;
    const videoId: string = req.params.id;
    const user: User = req.user!;

    try {
        await addInteraction(user._id.toString(), videoId, liked);
        res.status(204).send();
    } catch (e) {
        next(e);
    }
}

export const handleEditInteraction: CustomReqHandler = async (req, res, next) => {
    const videoId: string = req.params.id;
    const user: User = req.user!;

    try {
        await toggleInteraction(user._id.toString(), videoId);
        res.status(204).send();
    } catch (e) {
        next(e);
    }
}

export const handleRemoveInteraction: CustomReqHandler = async (req, res, next): Promise<void> => {
    const videoId: string = req.params.id;

    try {
        await deleteInteraction(req.user!._id.toString(), videoId);
        res.status(204).send();
    } catch (e) {
        next(e);
    }
}