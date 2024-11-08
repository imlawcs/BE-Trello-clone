import Joi from "joi";

class BoardSchema {
    public boardCreateSchema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required().allow(''),
    });

    public boardUpdateSchema = Joi.object({
        title: Joi.string(),
        description: Joi.string().allow(''),
    });

    public addListSchema = Joi.object({
        listId: Joi.number().required(),
        boardId: Joi.number().required(),
    });

    public removeListSchema = Joi.object({
        listId: Joi.number().required(),
        boardId: Joi.number().required(),
    });
}

export default new BoardSchema();