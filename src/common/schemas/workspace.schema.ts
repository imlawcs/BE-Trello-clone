import e from "express";
import Joi from "joi";

class WorkspaceSchema {
    workspaceCreateSchema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(50)
            .required(),
        description: Joi.string()
            .min(3)
            .max(255)
            .required()
    });

    workspaceUpdateSchema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(50),
        description: Joi.string()
            .min(3)
            .max(255)
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