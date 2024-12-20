import Joi from "joi";

class AttachmentSchema {
    public attachmentCreateSchema = Joi.object({
        name: Joi.string().required(),
        url: Joi.string().required(),
        cardId: Joi.number().required(),
    });

    public attachmentUpdateSchema = Joi.object({
        name: Joi.string().required(),
        url: Joi.string().required(),
    });
}

export default new AttachmentSchema();