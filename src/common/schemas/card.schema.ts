import Joi from "joi";

class CardSchema {
    public cardCreateSchema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required().allow(''),
        listId: Joi.number().required(),
    });

    public cardUpdateSchema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required().allow(''),
        listId: Joi.number().required(),
        boardId: Joi.number().required(),
    });

    public cardDeleteSchema = Joi.object({
        listId: Joi.number().required(),
        boardId: Joi.number().required(),
    });

    public assignUserSchema = Joi.object({
        userId: Joi.number().required(),
        cardId: Joi.number().required(),
    });

    public removeUserSchema = Joi.object({
        userId: Joi.number().required(),
        cardId: Joi.number().required(),
    });

    // public addLabelSchema = Joi.object({
    //     labelId: Joi.number().required(),
    //     cardId: Joi.number().required(),
    // });

    // public removeLabelSchema = Joi.object({
    //     labelId: Joi.number().required(),
    //     cardId: Joi.number().required(),
    // });

    public addCommentSchema = Joi.object({
        commentId: Joi.number().required(),
        cardId: Joi.number().required(),
    });

    public removeCommentSchema = Joi.object({
        commentId: Joi.number().required(),
        cardId: Joi.number().required(),
    });

    public addAttachmentSchema = Joi.object({
        attachmentId: Joi.number().required(),
        cardId: Joi.number().required(),
    });

    public removeAttachmentSchema = Joi.object({
        attachmentId: Joi.number().required(),
        cardId: Joi.number().required(),
    });

    // public addChecklistSchema = Joi.object({
    //     checklistId: Joi.number().required(),
    //     cardId: Joi.number().required(),
    // });

    // public removeChecklistSchema = Joi.object({
    //     checklistId: Joi.number().required(),
    //     cardId: Joi.number().required(),
    // });
}

export default new CardSchema();