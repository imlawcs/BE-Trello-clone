import checklistRepository from "./checklist.repository";
import cardService from "../cards/card.service";
import { Checklist } from "../../database/entities/checklist";
import customError from "../../common/error/customError";
import { Result } from "../../common/response/Result";

class ChecklistService {
    public async createChecklist(checklist: Checklist, cardId: number): Promise<Result> {
        try {
            if (!cardId) {
                throw new customError(400, "Card ID is required.");
            }
            const newChecklist = await checklistRepository.createChecklist(checklist);
            
            if (newChecklist.id === undefined) {
                throw new customError(500, "Failed to create checklist.");
            }
            await cardService.addChecklistToCard(cardId, newChecklist.id);
            return new Result(true, 201, "Checklist created successfully.");
        }
        catch (error) {
            throw error;
        }
    }

    public async getChecklistById(id: number): Promise<Result> {
        try {
            if(!id) {
                throw new customError(400, "Checklist ID is required.");
            }
            const checklist = await checklistRepository.getChecklistById(id);
            if (checklist == null) {
                throw new customError(404, "Checklist not found.");
            }
            return new Result(true, 200, "Checklist found.", {checklist: checklist});
        }
        catch (error) {
            throw error;
        }
    }

    public async getAllChecklistsOfCard(cardId: number): Promise<Result> {
        try {
            if (!cardId) {
                throw new customError(400, "Card ID is required.");
            }
            const checklists = await checklistRepository.getAllChecklistsOfCard(cardId);
            if (checklists.length == 0) {
                throw new customError(404, "Card has no checklists.");
            }
            return new Result(true, 200, "Checklists found.", {checklists: checklists});
        }
        catch (error) {
            throw error;
        }
    }

    public async updateChecklist(id: number, checklist: Checklist): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, "Checklist ID is required.");
            }
            const checklistExist = await checklistRepository.getChecklistById(id);
            if (!checklistExist) {
                throw new customError(404, "Checklist not found.");
            }
            await checklistRepository.updateChecklist(id, checklist);
            return new Result(true, 200, "Checklist updated successfully.");
        }
        catch (error) {
            throw error;
        }
    }

    public async deleteChecklist(id: number): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, "Checklist ID is required.");
            }
            const checklistExist = await checklistRepository.getChecklistById(id);
            if (!checklistExist) {
                throw new customError(404, "Checklist not found.");
            }
            await checklistRepository.deleteChecklist(id);
            return new Result(true, 200, "Checklist deleted successfully.");
        }
        catch (error) {
            throw error;
        }
    }
}

export default new ChecklistService();