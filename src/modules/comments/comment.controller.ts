import commentService from "./comment.service";
import { Request, Response, NextFunction } from "express";
import { Comment } from "../../database/entities/comment";
import customError from "../../common/error/customError";
import { Result } from "../../common/response/Result";

class CommentController {
    public async findCommentById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const result = await commentService.findCommentById(id);
            res.status(result.status).json(result);
        } catch (error) {
            next(new customError(400, `CommentController has error: ${error}`));
        }
    }

    public async createComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const comment = req.body as Comment;
            const result = await commentService.createComment(comment);
            res.status(result.status).json(result);
        } catch (error) {
            next(new customError(400, `CommentController has error: ${error}`));
        }
    }

    public async deleteComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const result = await commentService.deleteComment(id);
            res.status(result.status).json(result);
        } catch (error) {
            next(new customError(400, `CommentController has error: ${error}`));
        }
    }

    public async updateComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const comment = req.body as Partial<Comment>;
            const result = await commentService.updateComment(id, comment);
            res.status(result.status).json(result);
        } catch (error) {
            next(new customError(400, `CommentController has error: ${error}`));
        }
    }
}

export default new CommentController();