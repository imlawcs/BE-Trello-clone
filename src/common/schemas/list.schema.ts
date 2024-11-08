import Joi from "joi";

class ListSchema {
    public listCreateSchema = Joi.object({
        title: Joi.string().required()
    });

    public listUpdateSchema = Joi.object({
        title: Joi.string().required(),
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