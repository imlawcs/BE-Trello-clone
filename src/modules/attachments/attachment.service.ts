import attachmentRepository from "./attachment.repository";
import cardService from "../cards/card.service";
import { Attachment } from "../../database/entities/attachment";
import customError from "../../common/error/customError";
import { Result } from "../../common/response/Result";
import e from "express";
import { v2 as cloudinary } from 'cloudinary';

class AttachmentService {
    public async findAttachmentById(id: number): Promise<Attachment | null> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            const attachment = await attachmentRepository.findAttachmentById(id);
            return attachment || null;
        } catch (error) {
            throw error;
        }
    }

    public async createAttachment(attachment: Attachment): Promise<Attachment> {
        try {
            const newAttachment = await attachmentRepository.createAttachment(attachment);
            return newAttachment;
        } catch (error) {
            throw error;
        }
    }

    public async deleteAttachment(id: number): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            const AttachmentExist = await attachmentRepository.findAttachmentById(id);
            if (!AttachmentExist) {
                throw new customError(404, `Attachment ${id} not found`);
            }
            await attachmentRepository.deleteAttachment(id);
            return new Result(true, 200, `Attachment ${id} has been deleted`);
        } catch (error) {
            throw error;
        }
    }

    public async updateAttachment(id: number, attachment: Attachment): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            const AttachmentExist = await attachmentRepository.findAttachmentById(id);
            if (!AttachmentExist) {
                throw new customError(404, `Attachment ${id} not found`);
            }
            await attachmentRepository.updateAttachment(id, attachment);
            return new Result(true, 200, `Attachment ${id} has been updated`);
        } catch (error) {
            throw error;
        }
    }

    public async uploadFile(file: Express.Multer.File, cardId: number): Promise<Result> {
        try {
            if (!file) {
                throw new customError(400, 'No file uploaded');
            }

            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'attachments', 
                resource_type: 'auto',      
            });

            const attachment = new Attachment();
            attachment.name = file.originalname;  
            attachment.url = result.secure_url; 

            const newAttachment = await attachmentRepository.createAttachment(attachment);

            await cardService.addAttachmentToCard(cardId, newAttachment.id);
            return new Result(true, 200, "File uploaded successfully", { url: result.secure_url, public_id: result.public_id });
        } catch (error) {
            console.log('Error uploading file:', error);
            throw new customError(400, 'Upload failed');
        }
    }
}

export default new AttachmentService();