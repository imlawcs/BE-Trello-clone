import Joi from "joi";

class ListSchema {
    public listCreateSchema = Joi.object({
        title: Joi.string().required(),
        boardId: Joi.number().required(),
    });

    public listUpdateSchema = Joi.object({
        title: Joi.string().required(),
        boardId: Joi.number().required(),
    });

    public listDeleteSchema = Joi.object({
        boardId: Joi.number().required(),
    });

    public addCardSchema = Joi.object({
        cardId: Joi.number().required(),
        listId: Joi.number().required(),
    });

    public removeCardSchema = Joi.object({
        cardId: Joi.number().required(),
        listId: Joi.number().required(),
    });
}

export default new ListSchema();