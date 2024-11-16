import cardRepository from "./card.repository";
import { Result } from "../../common/response/Result";
import customError from "../../common/error/customError";
import { Card } from "../../database/entities/card";

class CardService {
    public async findAllCard(): Promise<Card[]> {
        try {
            const cards = await cardRepository.findAllCard();
            return cards;
        } catch (error) {
            throw new customError(400, `CardService has error: ${error}`);
        }
    }

    public async findByName(name: string): Promise<Card | null> {
        try {
            const card = await cardRepository.findByName(name);
            return card || null;
        } catch (error) {
            throw new customError(400, `CardService has error: ${error}`);
        }
    }

    public async findCardById(id: number): Promise<Card | null> {
        try {
            const card = await cardRepository.findCardById(id);
            return card;
        } catch (error) {
            throw new customError(400, `CardService has error: ${error}`);
        }
    }

    public async createCard(card: Card): Promise<Card> {
        try {
            const newCard = await cardRepository.createCard(card);
            return newCard;
        } catch (error) {
            throw new customError(400, `CardService has error: ${error}`);
        }
    }

    public async updateCard(id: number, card: Card): Promise<Result> {
        try {
            await cardRepository.updateCard(id, card);
            return new Result(true, 200, `Card ${id} has been updated`);
        } catch (error) {
            throw new customError(400, `CardService has error: ${error}`);
        }
    }

    public async deleteCard(id: number): Promise<Result> {
        try {
            await cardRepository.deleteCard(id);
            return new Result(true, 200, `Card ${id} has been deleted`);
        } catch (error) {
            throw new customError(400, `CardService has error: ${error}`);
        }
    }

    public async getListCards(listId: number): Promise<Card[]> {
        try {
            const cards = await cardRepository.getListCards(listId);
            return cards;
        } catch (error) {
            throw new customError(400, `CardService has error: ${error}`);
        }
    }

    public async addCardToList(cardId: number, listId: number): Promise<Result> {
        try {
            await cardRepository.addCardToList(cardId, listId);
            return new Result(true, 200, `Card ${cardId} has been added to List ${listId}`);
        } catch (error) {
            throw new customError(400, `CardService has error: ${error}`);
        }
    }

    public async removeCardFromList(cardId: number, listId: number): Promise<Result> {
        try {
            await cardRepository.removeCardFromList(cardId, listId);
            return new Result(true, 200, `Card ${cardId} has been removed from List ${listId}`);
        } catch (error) {
            throw new customError(400, `CardService has error: ${error}`);
        }
    }
}

export default new CardService();
