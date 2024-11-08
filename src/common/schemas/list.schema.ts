import Joi from "joi";

class ListSchema {
    public listCreateSchema = Joi.object({
        name: Joi.string().required(),
        boardId: Joi.string().required(),
    });

    public listUpdateSchema = Joi.object({
        name: Joi.string().required(),
    });

    public addCardSchema = Joi.object({
        cardId: Joi.string().required(),
        listId: Joi.string().required(),
    });

    public removeCardSchema = Joi.object({
        cardId: Joi.string().required(),
        listId: Joi.string().required(),
    });
}

export default new ListSchema();