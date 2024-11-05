import { dbSource } from "../../config/ormconfig";
import { List } from "../../database/entities/list";
import customError from "../../common/error/customError";
import { Board } from "../../database/entities/board";
import { Card } from "../../database/entities/card";
import e from "express";
import { custom } from "joi";

class ListRepository {
    private readonly listRepository = dbSource.getRepository(List);

    public async findAllList(): Promise<List[]> {
        try {
            const lists = await this.listRepository.find({
                select: ["id", "title"],
                relations: ["cards"],
            });

            return lists.map(list => ({
                id: list.id,
                title: list.title,
                cards: list.cards,
                board: list.board,
            }));
        } catch (error) {
            throw new customError(400, `ListRepository has error: ${error}`);
        }
    }

    public async findByName(name: string): Promise<List | null> {
        try {
            const list = await this.listRepository.findOne({
                select: ["id", "title"],
                where: {
                    title: name,
                },
                relations: ["cards"],
            });
            return list;
        }
        catch (error) {
            throw new customError(400, `ListRepository has error: ${error}`);
        }
    }

    public async findByListId(id: number): Promise<List | null> {
        try {
            const list = await this.listRepository.findOne({
                select: ["id", "title"],
                where: {
                    id,
                },
                relations: ["cards"],
            });
            return list;
        }
        catch (error) {
            throw new customError(400, `ListRepository has error: ${error}`);
        }
    }

    public async createList(list: List): Promise<List> {
        try {
            await this.listRepository.save(list);
            return list;
        } catch (error) {
            throw new customError(400, `ListRepository has error: ${error}`);
        }
    }

    public async updateList(id: number, list: List): Promise<void> {
        try {
            const listExist = await this.listRepository.findOne(
                {
                    where: {
                        id,
                    },
                }
            );
            if (!listExist) {
                throw new customError(404, "List not found");
            }
            await this.listRepository.update(id, list);
        } catch (error) {
            throw new customError(400, `ListRepository has error: ${error}`);
        }
    }

    public async deleteList(id: number): Promise<void> {
        try {
            const list = await this.listRepository.findOne(
                {
                    where: {
                        id,
                    },
                }
            );
            if (!list) {
                throw new customError(404, "List not found");
            }
            await this.listRepository.remove(list);
        } catch (error) {
            throw new customError(400, `ListRepository has error: ${error}`);
        }
    }

    public async getListCards(id: number): Promise<Card[]> {
        try {
            const list = await this.listRepository.findOne({
                select: ["id", "title"],
                where: {
                    id,
                },
                relations: ["cards"],
            });
            if (!list) {
                throw new customError(404, "List not found");
            }
            return list.cards;
        } catch (error) {
            throw new customError(400, `ListRepository has error: ${error}`);
        }
    }

    // public async inCardInList()

    public async addCardToList(list: List, card: Card): Promise<void> {
        try {
            const listExist = await this.listRepository.findOne({
                where: {
                    id: list.id,
                },
                relations: ["cards"],
            });
            if (!listExist) {
                throw new customError(404, "List not found");
            }
            const cardExist = await dbSource.getRepository(Card).findOne({
                where: {
                    id: card.id,
                },
            });
            if (!cardExist) {
                throw new customError(404, "Card not found");
            }
            list.cards.push(card);
            await this.listRepository.save(list);
        } catch (error) {
            throw new customError(400, `ListRepository has error: ${error}`);
        }
    }

    public async removeCardFromList(list: List, card: Card): Promise<void> {
        try {
            const cardExist = await dbSource.getRepository(Card).findOne({
                where: {
                    id: card.id
                }
            })
            if(!cardExist) {
                throw new customError(404, "Card not found");
            }

            const listExist = await this.listRepository.findOne({
                where: {
                    id: list.id
                }
            })
            if(!listExist) {
                throw new customError(404, "List not found");
            }

            // await this.listRepository.filter
        }   
        catch(error) {
            throw new customError(400, `ListRepository has error: ${error}`);
        }
    }
}

export default new ListRepository();