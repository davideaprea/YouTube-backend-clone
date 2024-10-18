import { CustomReqHandler } from "../../core/types/custom-req-handler.interface";
import { createComment, deleteComment } from "../services/comment.service";
import { CommentDocument } from "../types/documents/comment-document.type";

export const handleCreateComment: CustomReqHandler = async (req, res, next): Promise<void> => {
    try {
        req.body.userId = req.appUser!._id;

        const comment: CommentDocument = await createComment(req.body);

        res.status(200).json(comment);
    } catch (e) {
        next(e);
    }
}

export const handleDeleteComment: CustomReqHandler = async (req, res, next): Promise<void> => {
    try {
        const videoId: string = req.params.id;
        const userId: string = req.appUser!._id.toString();

        //await deleteComment(videoId, userId);
        res.status(204).send();
    } catch (e) {
        next(e);
    }
}