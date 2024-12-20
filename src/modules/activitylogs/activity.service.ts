import activityRepository from "./activity.repository";
import { ActivityLog } from "../../database/entities/activitylog";
import { Result } from "../../common/response/Result";
import customError from "../../common/error/customError";

class ActivityService {
    public async createActivity(activity: ActivityLog): Promise<Result> {
        try {
            const result = await activityRepository.createActivityLog(activity);
            return new Result(true, 201, "Activity created", result);
        } catch (error) {
            throw error;
        }
    }

    public async getActivityLogsOfBoard(boardId: number): Promise<Result> {
        try {
            if (!boardId) {
                throw new customError(400, "Board ID is required");
            }
            const result = await activityRepository.getActivityLogsOfBoard(boardId);
            if (result.length === 0) {
                throw new customError(404, "No activity logs found for this board");
            }
            return new Result(true, 200, "Activity logs of board", result);
        } catch (error) {
            throw error;
        }
    }

    public async getActivityLogsOfCard(cardId: number): Promise<Result> {
        try {
            if (!cardId) {
                throw new customError(400, "Card ID is required");
            }
            const result = await activityRepository.getActivityLogsOfCard(cardId);
            if (result.length === 0) {
                throw new customError(404, "No activity logs found for this card");
            }
            return new Result(true, 200, "Activity logs of card", result);
        } catch (error) {
            throw error;
        }
    }
}

export default new ActivityService();