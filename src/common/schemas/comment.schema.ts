import Joi from "joi";

class CommentSchema {
    public commentCreateSchema = Joi.object({
        comment: Joi.string().required(),
        cardId: Joi.number().required(),
        boardId: Joi.number().required(),
    });

    public commentUpdateSchema = Joi.object({
        comment: Joi.string().required(),
    });
}

export default new CommentSchema();