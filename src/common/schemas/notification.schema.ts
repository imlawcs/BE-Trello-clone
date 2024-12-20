import Joi from "joi";

class NotificationSchema {
    public createNotification = Joi.object({
        message: Joi.string().required(),
        type: Joi.string().required().valid('TASK_CREATED', 'TASK_UPDATED', 'COMMENT_ADDED'),
        userId: Joi.number(),
    });
}

export default new NotificationSchema();