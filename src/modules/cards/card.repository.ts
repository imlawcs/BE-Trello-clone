import { dbSource } from "../../config/ormconfig";
import { Card } from "../../database/entities/card";
import customError from "../../common/error/customError";
import { List } from "../../database/entities/list";
import { Result } from "../../common/response/Result";

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
            return card || null;
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

    public async createCard(card: Card): Promise<Card> {
        try {
            const newCard = await dbSource.getRepository(Card).save(card);
            return newCard;
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async updateCard(id: number, card: Partial<Card>): Promise<void> {
        try {
            await dbSource.getRepository(Card).update(id, card);
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async deleteCard(id: number): Promise<void> {
        try {
            const card = await dbSource.getRepository(Card).findOne({
                where: {
                    id,
                },
            });
            if (!card) {
                throw new customError(400, `Card not found`);
            }
            await dbSource.getRepository(Card).delete(id);
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async addCardToList(cardId: number, listId: number): Promise<void> {
        try {
            const card = await dbSource.getRepository(Card).findOne({
                where: {
                    id: cardId,
                },
            });
            if (!card) {
                throw new customError(400, `Card not found`);
            }

            const list = await dbSource.getRepository(List).findOne({
                where: {
                    id: listId,
                },
            });
            if (!list) {
                throw new customError(400, `List not found`);
            }

            list.cards.push(card);
            await dbSource.getRepository(List).save(list);
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async removeCardFromList(cardId: number, listId: number): Promise<void> {
        try {
            const card = await dbSource.getRepository(Card).findOne({
                where: {
                    id: cardId,
                },
            });
            if (!card) {
                throw new customError(400, `Card not found`);
            }

            const list = await dbSource.getRepository(List).findOne({
                where: {
                    id: listId,
                },
            });
            if (!list) {
                throw new customError(400, `List not found`);
            }

            list.cards = list.cards.filter((c) => c.id !== cardId);
            await dbSource.getRepository(List).save(list);
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async getListCards(listId: number): Promise<Card[]> {
        try {
            const list = await dbSource.getRepository(List).findOne({
                where: {
                    id: listId,
                },
                relations: ["cards"],
            });
            if (!list) {
                throw new customError(400, `List not found`);
            }
            return list.cards;
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async findCardInList(cardId: number, listId: number): Promise<Card | null> {
        try {
            const list = await dbSource.getRepository(List).findOne({
                where: {
                    id: listId,
                },
                relations: ["cards"],
            });
            if (!list) {
                throw new customError(400, `List not found`);
            }

            const card = list.cards.find((c) => c.id === cardId);
            return card || null;
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }
}

export default new CardRepository();