import listRepository from "./list.repository";
import cardRepository from "../cards/card.repository";
import { List } from "../../database/entities/list";
import customError from "../../common/error/customError";
import { Result } from "../../common/response/Result";

class ListService {
    public async findAllList(): Promise<List[]> {
        try {
            const list = await listRepository.findAllList();
            if (list.length === 0) {
                throw new customError(404, "List not found");
            }
            return list;

        } catch (error) {
            throw error;
        }
    }

    public async findByName(name: string): Promise<List | null> {
        try {
            if (!name) {
                throw new customError(400, "Name is required");
            }
            const list = await listRepository.findByName(name);
            if (!list) {
                throw new customError(404, "List not found");
            }
            return list;
        } catch (error) {
            throw error;
        }
    }

    public async findByListId(id: number): Promise<List | null> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            const list = await listRepository.findByListId(id);
            if (!list) {
                throw new customError(404, "List not found");
            }
            return list;
        } catch (error) {
            throw error;
        }
    }

    public async createList(list: List): Promise<Result> {
        try {
            const newList = await listRepository.createList(list);
            return new Result( true, 201, "Create list successfully", newList);
        } catch (error) {
            throw error;
        }
    }

    public async updateList(id: number, list: Partial<List>): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            const listExist = await listRepository.findByListId(id);
            if (!listExist) {
                throw new customError(404, "List not found");
            }
            await listRepository.updateList(id, list);
            return new Result( true, 200, "Update list successfully");
        } catch (error) {
            throw error;
        }
    }

    public async deleteList(id: number): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            const listExist = await listRepository.findByListId(id);
            if (!listExist) {
                throw new customError(404, "List not found");
            }
            await listRepository.deleteList(id);
            return new Result( true, 200, "Delete list successfully");
        } catch (error) {
            throw error;
        }
    }

    public async addCardToList(listId: number, cardId: number): Promise<Result> {
        try {
            if (!listId || !cardId) {
                throw new customError(400, "ListId and CardId are required");
            }
            const listExist = await listRepository.findByListId(listId);
            if (!listExist) {
                throw new customError(404, "List not found");
            }

            const cardExist = await cardRepository.findCardById(cardId);
            if (!cardExist) {
                throw new customError(404, "Card not found");
            }

            const isCardInList = await listRepository.isCardInList(listExist, cardExist);
            if (isCardInList) {
                throw new customError(400, "Card is already in list");
            }

            await listRepository.addCardToList(listExist, cardExist);
            return new Result( true, 200, "Add card to list successfully");
        } catch (error) {
            throw error;
        }
    }

    public async getListCards(id: number): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            const list = await listRepository.findByListId(id);
            if (!list) {
                throw new customError(404, "List not found");
            }
            const cards = await listRepository.getListCards(id);
            if(cards.length === 0) {
                throw new customError(404, "List has no card");
            }
            return new Result( true, 200, "Get list cards successfully", cards);
        } catch (error) {
            throw error;
        }
    }

    public async removeCardFromList(listId: number, cardId: number): Promise<Result> {
        try {
            if (!listId || !cardId) {
                throw new customError(400, "ListId and CardId are required");
            }
            const listExist = await listRepository.findByListId(listId);
            if (!listExist) {
                throw new customError(404, "List not found");
            }

            const cardExist = await cardRepository.findCardById(cardId);
            if (!cardExist) {
                throw new customError(404, "Card not found");
            }

            const isCardInList = await listRepository.isCardInList(listExist, cardExist);
            if (!isCardInList) {
                throw new customError(400, "Card is not in list");
            }

            await listRepository.removeCardFromList(listExist, cardExist);
            return new Result( true, 200, "Remove card from list successfully");
        } catch (error) {
            throw error;
        }
    }
}

export default new ListService();


