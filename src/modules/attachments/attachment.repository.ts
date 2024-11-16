import customError from "../../common/error/customError";
import { Attachment } from "../../database/entities/attachment";
import { dbSource } from "../../config/ormconfig";

class AttachmentRepository {
    public async findAttachmentById(id: number): Promise<Attachment | null> {
        try {
            const attachment = await dbSource.getRepository(Attachment).findOne({
                select: ["id", "name", "url"],
                where: {
                    id,
                },
            });
            return attachment;
        } catch (error) {
            throw new customError(400, `AttachmentRepository has error: ${error}`);
        }
    }

    public async createAttachment(attachment: Attachment): Promise<Attachment> {
        try {
            const newAttachment = await dbSource.getRepository(Attachment).save(attachment);
            return newAttachment;
        } catch (error) {
            throw new customError(400, `AttachmentRepository has error: ${error}`);
        }
    }

    public async deleteAttachment(id: number): Promise<void> {
        try {
            await dbSource.getRepository(Attachment).delete(id);
        } catch (error) {
            throw new customError(400, `AttachmentRepository has error: ${error}`);
        }
    }

    public async updateAttachment(id: number, attachment: Partial<Attachment>): Promise<void> {
        try {
            await dbSource.getRepository(Attachment).update(id, attachment);
        } catch (error) {
            throw new customError(400, `AttachmentRepository has error: ${error}`);
        }
    }
}

export default new AttachmentRepository();