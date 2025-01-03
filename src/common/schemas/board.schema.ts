import Joi from "joi";

class BoardSchema {
    public boardCreateSchema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required().allow(''),
        workspaceId: Joi.number().required(),
    });

    public boardUpdateSchema = Joi.object({
        title: Joi.string(),
        description: Joi.string().allow(''),
        workspaceId: Joi.number().required(),
    });

    public boardDeleteSchema = Joi.object({
        workspaceId: Joi.number().required(),
    });

    public addListSchema = Joi.object({
        listId: Joi.number().required(),
        boardId: Joi.number().required(),
    });

    public removeListSchema = Joi.object({
        listId: Joi.number().required(),
        boardId: Joi.number().required(),
    });

    public addUsersSchema = Joi.object({
        userId: Joi.number().required(),
        boardId: Joi.number().required(),
    });

    public removeUsersSchema = Joi.object({
        userId: Joi.number().required(),
        boardId: Joi.number().required(),
    });

    public assignRoleInBoardSchema = Joi.object({
        userId: Joi.number().required(),
        boardId: Joi.number().required(),
        roleId: Joi.number().required(),
    });
}

export default new BoardSchema();