import attachmentRepository from "./attachment.repository";
import cardService from "../cards/card.service";
import { Attachment } from "../../database/entities/attachment";
import customError from "../../common/error/customError";
import { Result } from "../../common/response/Result";
import e from "express";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

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
            if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
                console.error('Cloudinary config missing:', {
                    api_key: !!process.env.CLOUDINARY_API_KEY,
                    api_secret: !!process.env.CLOUDINARY_API_SECRET,
                    cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME
                });
                throw new customError(500, 'Thiếu cấu hình Cloudinary');
            }

            if (!file) {
                throw new customError(400, 'Không tìm thấy file');
            }

            console.log('Bắt đầu upload file:', file.originalname);
            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: 'attachments',
                resource_type: 'auto',
            });
            console.log('Upload thành công:', uploadResult.secure_url);

            const attachment = new Attachment();
            attachment.name = file.originalname;
            attachment.url = uploadResult.secure_url;

            const savedAttachment = await attachmentRepository.createAttachment(attachment);
            if (!savedAttachment) {
                throw new customError(500, 'Lỗi khi lưu attachment vào database');
            }

            await cardService.addAttachmentToCard(cardId, savedAttachment.id);

            return new Result(true, 200, "Upload file thành công", {
                id: savedAttachment.id,
                name: savedAttachment.name,
                url: savedAttachment.url,
                publicId: uploadResult.public_id
            });

        } catch (error) {
            console.error('Chi tiết lỗi upload:', error);
            
            if (error instanceof customError) {
                throw error;
            }

            throw new customError(500, `Upload thất bại: ${error}`);
        }
    }
}

export default new AttachmentService();