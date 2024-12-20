import { dbSource } from "../../config/ormconfig";
import { List } from "../../database/entities/list";
import customError from "../../common/error/customError";
import { Card } from "../../database/entities/card";

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
            const newList : List = await this.listRepository.save(list);
            return newList;
        } catch (error) {
            throw new customError(400, `ListRepository has error: ${error}`);
        }
    }

    public async updateList(id: number, list: Partial<List>): Promise<void> {
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

    public async isCardInList(listId: number, cardId: number): Promise<boolean> {
        try {
            const listExist = await this.listRepository.findOne({
                where: {
                    id: listId,
                },
                relations: ["cards"],
            });
            if (!listExist) {
                throw new customError(404, "List not found");
            }
            const cardExist = await dbSource.getRepository(Card).findOne({
                where: {
                    id: cardId,
                },
            });
            if (!cardExist) {
                throw new customError(404, "Card not found");
            }
            return listExist.cards.some(c => c.id === cardId);
        } catch (error) {
            throw new customError(400, `ListRepository has error: ${error}`);
        }
    }

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

            list.cards = list.cards.filter(c => c.id !== card.id);
        }   
        catch(error) {
            throw new customError(400, `ListRepository has error: ${error}`);
        }
    }
}

export default new ListRepository();