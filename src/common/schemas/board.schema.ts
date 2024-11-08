import Joi from "joi";

class BoardSchema {
    public boardCreateSchema = Joi.object({
        name: Joi.string().required(),
    });

    public boardUpdateSchema = Joi.object({
        name: Joi.string().required(),
    });

    public addListSchema = Joi.object({
        listId: Joi.string().required(),
        boardId: Joi.string().required(),
    });

    public removeListSchema = Joi.object({
        listId: Joi.string().required(),
        boardId: Joi.string().required(),
    });
}

export default new BoardSchema();