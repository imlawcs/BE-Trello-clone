import checklistService from "./checklist.service";
import { Request, Response, NextFunction } from "express";
import { Checklist } from "../../database/entities/checklist";

class ChecklistController {
    public async createChecklist(req: Request, res: Response, next: NextFunction) {
        try {
            const checklist: Checklist = req.body;
            const cardId = parseInt(req.body.cardId);
            const result = await checklistService.createChecklist(checklist, cardId);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async getChecklistById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await checklistService.getChecklistById(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async getAllChecklistsOfCard(req: Request, res: Response, next: NextFunction) {
        try {
            const cardId = parseInt(req.params.cardId);
            const result = await checklistService.getAllChecklistsOfCard(cardId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async updateChecklist(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const checklist: Checklist = req.body;
            const result = await checklistService.updateChecklist(id, checklist);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async deleteChecklist(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await checklistService.deleteChecklist(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new ChecklistController();