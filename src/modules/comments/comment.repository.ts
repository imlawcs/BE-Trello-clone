import { Comment } from "../../database/entities/comment";
import { dbSource } from "../../config/ormconfig";
import customError from "../../common/error/customError";

class CommentRepository {
    public async findCommentById(id: number): Promise<Comment | null> {
        try {
            const comment = await dbSource.getRepository(Comment).findOne(
                {
                    select: ["id", "comment"],
                    where: {
                        id,
                    },
                    relations: ["user"],
                }
            );
            return comment;
        } catch (error) {
            throw new customError(400, `CommentRepository has error: ${error}`);
        }
    }

    public async getCommentOwner(commentId: number) {
    
        const comment = await dbSource.getRepository(Comment).findOne({
            where: { id: commentId },
            relations: ["user"],
        });
    
        if (!comment) {
            throw new Error("Comment not found");
        }
    
        console.log("Comment belongs to user:", comment.user);
        return comment.user;
    }

    public async createComment(comment: Comment): Promise<Comment> {
        try {
            const newComment = await dbSource.getRepository(Comment).save(comment);
            return newComment;
        } catch (error) {
            throw new customError(400, `CommentRepository has error: ${error}`);
        }
    }

    public async deleteComment(id: number): Promise<void> {
        try {
            await dbSource.getRepository(Comment).delete(id);
        } catch (error) {
            throw new customError(400, `CommentRepository has error: ${error}`);
        }
    }

    public async updateComment(id: number, comment: Partial<Comment>): Promise<void> {
        try {
            await dbSource.getRepository(Comment).update(id, comment);
        } catch (error) {
            throw new customError(400, `CommentRepository has error: ${error}`);
        }
    }
}

export default new CommentRepository();

