import attachmentService from "./attachment.service";
import { Attachment } from "../../database/entities/attachment";
import { Request, Response, NextFunction } from "express";
import customError from "../../common/error/customError";
import { Result } from "../../common/response/Result";

class AttachmentController {
    public async findAttachmentById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const attachment = await attachmentService.findAttachmentById(id);
            if (!attachment) {
                throw new customError(404, `Attachment ${id} not found`);
            }
            res.status(200).json(attachment);
        } catch (error) {
            next(error);
        }
    }

    public async createAttachment(req: Request, res: Response, next: NextFunction) {
        try {
            const attachment: Attachment = req.body;
            const newAttachment = await attachmentService.createAttachment(attachment);
            res.status(201).json(newAttachment);
        } catch (error) {
            next(error);
        }
    }

    public async deleteAttachment(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const result = await attachmentService.deleteAttachment(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async updateAttachment(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const attachment: Attachment = req.body;
            const result = await attachmentService.updateAttachment(id, attachment);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new AttachmentController();