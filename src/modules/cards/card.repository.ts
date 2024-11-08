import { dbSource } from "../../config/ormconfig";
import { Card } from "../../database/entities/card";
import customError from "../../common/error/customError";
import { List } from "../../database/entities/list";
import { Result } from "../../common/response/Result";
import e from "express";

class CardRepository {
    public async findAllCard(): Promise<Card[]> {
        try {
            const cards = await dbSource.getRepository(Card).find({
                select: ["id", "title", "description"],
            });
            return cards;
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async findByName(name: string): Promise<Card | null> {
        try {
            const card = await dbSource.getRepository(Card).findOne({
                select: ["id", "title", "description"],
                where: {
                    title: name,
                },
            });
            return card;
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async findCardById(id: number): Promise<Card | null> {
        try {
            const card = await dbSource.getRepository(Card).findOne({
                select: ["id", "title", "description"],
                where: {
                    id,
                },
            });
            return card;
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }
}

export default new CardRepository();