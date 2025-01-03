import Joi from "joi";
import { title } from "process";

class ChecklistSchema {
    public checklistCreateSchema = Joi.object({
        title: Joi.string().required(),
        dueDate: Joi.date().required(),
        isDone: Joi.boolean().required(),
        cardId: Joi.number().required(),
        boardId: Joi.number().required(),
    });

    public checklistUpdateSchema = Joi.object({
        title: Joi.string().required(),
        dueDate: Joi.date().required(),
        isDone: Joi.boolean().required(),
        cardId: Joi.number().required(),
        listId: Joi.number().required(),
        boardId: Joi.number().required(),
    });

    public checklistDeleteSchema = Joi.object({
        cardId: Joi.number().required(),
        listId: Joi.number().required(),
        boardId: Joi.number().required(),
    });
}

export default new ChecklistSchema();