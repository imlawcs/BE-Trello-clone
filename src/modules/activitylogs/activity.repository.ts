import { dbSource } from "../../config/ormconfig";
import { ActivityLog } from "../../database/entities/activitylog";
import { Board } from "../../database/entities/board";
import boardRepository from "../boards/board.repository";
import { User } from "../../database/entities/user";
import { Card } from "../../database/entities/card";
import customError from "../../common/error/customError";

class ActivityRepository {
    public async createActivityLog(activity: ActivityLog): Promise<ActivityLog> {
        try {
            return await dbSource.getRepository(ActivityLog).save(activity);
        } catch (error) {
            throw error;
        }
    }

    public async getActivityLogsOfBoard(boardId: number): Promise<ActivityLog[]> {
        try {
            const board = await dbSource.getRepository(Board).findOne({
                where: {
                    id: boardId 
                }, 
                relations: ["activityLogs"] 
            });
            if (!board) {
                throw new customError(404, "Board not found");
            }
            return board.activityLogs;
        }
        catch (error) {
            throw error;
        }
    }

    public async getActivityLogsOfCard(cardId: number): Promise<ActivityLog[]> {
        try {
            const card = await dbSource.getRepository(Card).findOne({
                where: {
                    id: cardId
                },
                relations: ["activityLogs"]
            });
            if (!card) {
                throw new customError(404, "Card not found");
            }
            return card.activityLogs;
        }
        catch (error) {
            throw error;
        }
    }
}

export default new ActivityRepository();

