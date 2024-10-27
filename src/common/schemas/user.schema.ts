import Joi from 'joi';

class UserSchema {
    userUpdateSchema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(30),
        email: Joi.string()
            .email({ minDomainSegments: 2 })
            .trim(),
        password: Joi.string()
            .min(6),
        fullname: Joi.string()
            .min(3)
            .max(100)
    });
    
    assignRoleSchema = Joi.object({
        roleId: Joi.number()
        .required(),
        userId: Joi.number()
        .required()
    });
        
    removeRoleSchema = Joi.object({
        roleId: Joi.number()
        .required(),
        userId: Joi.number()
        .required()
    });
}

export default new UserSchema();
