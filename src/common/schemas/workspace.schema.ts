import e from "express";
import Joi from "joi";

class WorkspaceSchema {
    workspaceCreateSchema = Joi.object({
        title: Joi.string()
            .min(3)
            .max(50)
            .required(),
        description: Joi.string()
            .min(3)
            .max(255)
            .required()
            .allow('')
    });

    workspaceUpdateSchema = Joi.object({
        title: Joi.string()
            .min(3)
            .max(50),
        description: Joi.string()
            .min(3)
            .max(255)
            .allow('')
    });

    addUserToWorkspaceSchema = Joi.object({
        workspaceId: Joi.number()
            .required(),
        userId: Joi.number()
            .required()
    });

    removeUserFromWorkspaceSchema = Joi.object({
        workspaceId: Joi.number()
            .required(),
        userId: Joi.number()
            .required()
    });
}

export default new WorkspaceSchema();