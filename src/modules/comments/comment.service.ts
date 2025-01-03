import commentRepository from "./comment.repository";
import cardService from "../cards/card.service";
import { Comment } from "../../database/entities/comment";
import customError from "../../common/error/customError";
import { Result } from "../../common/response/Result";
import { User } from "../../database/entities/user";

class CommentService {
    public async findCommentById(id: number): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            const comment = await commentRepository.findCommentById(id);
            if (!comment) {
                throw new customError(404, "Comment not found");
            }
            return new Result(true, 200, "Comment found", comment);
        } catch (error) {
            throw error;
        }
    }

    

    public async createComment(comment: Comment, cardId: number, userId: number, boardId: number): Promise<Result> {
        try {
            if (!cardId) {
                throw new customError(400, "Card id is required");
            }
            const newComment = await commentRepository.createComment(comment);
            await cardService.addCommentToCard(cardId, newComment.id, userId, boardId);
            return new Result(true, 201, "Comment created", newComment);
        } catch (error) {
            throw error;
        }
    }

    public async deleteComment(id: number): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            const commentExist = await commentRepository.findCommentById(id);
            if (!commentExist) {
                throw new customError(404, "Comment not found");
            }
            await commentRepository.deleteComment(id);
            return new Result(true, 200, "Comment deleted");
        } catch (error) {
            throw error;
        }
    }

    public async updateComment(id: number, comment: Partial<Comment>): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            const commentExist = await commentRepository.findCommentById(id);
            if (!commentExist) {
                throw new customError(404, "Comment not found");
            }
            await commentRepository.updateComment(id, comment);
            return new Result(true, 200, "Comment updated");
        } catch (error) {
            throw error;
        }
    }
}

export default new CommentService();