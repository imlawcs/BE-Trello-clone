import commentRepository from "./comment.repository";
import { Comment } from "../../database/entities/comment";
import customError from "../../common/error/customError";
import { Result } from "../../common/response/Result";

class CommentService {
    public async findCommentById(id: number): Promise<Result> {
        try {
            const comment = await commentRepository.findCommentById(id);
            if (!comment) {
                throw new customError(404, "Comment not found");
            }
            return new Result(true, 200, "Comment found", comment);
        } catch (error) {
            throw new customError(400, `CommentService has error: ${error}`);
        }
    }

    public async createComment(comment: Comment): Promise<Result> {
        try {
            const newComment = await commentRepository.createComment(comment);
            return new Result(true, 201, "Comment created", newComment);
        } catch (error) {
            throw new customError(400, `CommentService has error: ${error}`);
        }
    }

    public async deleteComment(id: number): Promise<Result> {
        try {
            await commentRepository.deleteComment(id);
            return new Result(true, 204, "Comment deleted");
        } catch (error) {
            throw new customError(400, `CommentService has error: ${error}`);
        }
    }

    public async updateComment(id: number, comment: Partial<Comment>): Promise<Result> {
        try {
            await commentRepository.updateComment(id, comment);
            return new Result(true, 200, "Comment updated");
        } catch (error) {
            throw new customError(400, `CommentService has error: ${error}`);
        }
    }
}

export default new CommentService();