import Joi from 'joi';

class RoleSchema {
    roleSchema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(30)
            .required()
    });

    assignPermissionSchema = Joi.object({
        permissionId: Joi.number()
            .required(),
        roleId: Joi.number()
            .required()
    });

    removePermissionSchema = Joi.object({
        permissionId: Joi.number()
            .required(),
        roleId: Joi.number()
            .required()
    });
}

export default new RoleSchema();
