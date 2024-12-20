import activityService from "./activity.service";
import { ActivityLog } from "../../database/entities/activitylog";
import { Request, Response, NextFunction } from "express";

class ActivityController {
    public async createActivity(req: Request, res: Response, next: NextFunction) {
        try {
            const activity: ActivityLog = req.body;
            const result = await activityService.createActivity(activity);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async getActivityLogsOfBoard(req: Request, res: Response, next: NextFunction) {
        try {
            const boardId = Number(req.params.boardId);
            const result = await activityService.getActivityLogsOfBoard(boardId);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async getActivityLogsOfCard(req: Request, res: Response, next: NextFunction) {
        try {
            const cardId = Number(req.params.cardId);
            const result = await activityService.getActivityLogsOfCard(cardId);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new ActivityController();