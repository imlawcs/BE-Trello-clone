import attachmentRepository from "./attachment.repository";
import { Attachment } from "../../database/entities/attachment";
import customError from "../../common/error/customError";
import { Result } from "../../common/response/Result";
import e from "express";

class AttachmentService {
    public async findAttachmentById(id: number): Promise<Attachment | null> {
        try {
            const attachment = await attachmentRepository.findAttachmentById(id);
            return attachment || null;
        } catch (error) {
            throw new customError(400, `AttachmentService has error: ${error}`);
        }
    }

    public async createAttachment(attachment: Attachment): Promise<Attachment> {
        try {
            const newAttachment = await attachmentRepository.createAttachment(attachment);
            return newAttachment;
        } catch (error) {
            throw new customError(400, `AttachmentService has error: ${error}`);
        }
    }

    public async deleteAttachment(id: number): Promise<Result> {
        try {
            await attachmentRepository.deleteAttachment(id);
            return new Result(true, 200, `Attachment ${id} has been deleted`);
        } catch (error) {
            throw new customError(400, `AttachmentService has error: ${error}`);
        }
    }

    public async updateAttachment(id: number, attachment: Attachment): Promise<Result> {
        try {
            await attachmentRepository.updateAttachment(id, attachment);
            return new Result(true, 200, `Attachment ${id} has been updated`);
        } catch (error) {
            throw new customError(400, `AttachmentService has error: ${error}`);
        }
    }
}

export default new AttachmentService();