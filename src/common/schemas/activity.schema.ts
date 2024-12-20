import Joi from "joi";

class ActivitySchema {
    public activityCreateSchema = Joi.object({
        boardId: Joi.number().required(),
        userId: Joi.number().required(),
        action: Joi.string().required(),
        description: Joi.string().required()
    });
}

export default new ActivitySchema();