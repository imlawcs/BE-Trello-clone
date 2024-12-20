import { dbSource } from "../../config/ormconfig";
import { Card } from "../../database/entities/card";
import { Checklist } from "../../database/entities/checklist";
import customError from "../../common/error/customError";

class ChecklistRepository {
    public async createChecklist(checklist: Checklist): Promise<Checklist> {
        try {
            const newChecklist = await dbSource.manager.save(checklist);
            return newChecklist;
        }
        catch (error) {
            throw error;
        }
    }

    public async getChecklistById(id: number): Promise<Checklist | null> {
        try {
            const checklist = await dbSource.getRepository(Checklist).findOne({
                select: ["id", "title", "dueDate", "isDone"],
                where: {
                    id
                }
            });
            return checklist || null;
        }
        catch (error) {
            throw error;
        }
    }

    public async getAllChecklistsOfCard(cardId : number): Promise<Checklist[]> {
        try {
            const card = await dbSource.getRepository(Card).findOne({
                where: {
                    id: cardId
                },
                relations: ["checklists"]
            });
            if (!card) {
                throw new customError(404, "Card not found");
            }
            return card.checklists;
        }
        catch (error) {
            throw error;
        }
    }

    public async updateChecklist(id: number, checklist: Checklist): Promise<void> {
        try {
            await dbSource.getRepository(Checklist).update(id, checklist);
        }
        catch (error) {
            throw error;
        }
    }

    public async deleteChecklist(id: number): Promise<void> {
        try {
            await dbSource.getRepository(Checklist).delete(id);
        }
        catch (error) {
            throw error;
        }
    }
}

export default new ChecklistRepository();
