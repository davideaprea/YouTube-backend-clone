import { CustomReqHandler } from "../../core/types/custom-req-handler.interface";
import { createComment, deleteComment } from "../services/comment.service";

export const handleCreateComment: CustomReqHandler = async (req, res, next) => {
    try {
        req.body.userId = req.user!._id;

        const comment = await createComment(req.body);

        res.status(200).json(comment);
    } catch (e) {
        next(e);
    }
}

export const handleDeleteComment: CustomReqHandler = async (req, res, next) => {
    try {
        await deleteComment(req.params.id);
        res.status(204).send();
    } catch (e) {
        next(e);
    }
}