import cardService from "./card.service";
import { Request, Response, NextFunction } from "express";
import customError from "../../common/error/customError";
import { Card } from "../../database/entities/card";
import { Result } from "../../common/response/Result";

class CardController {
    public async findAllCard(req: Request, res: Response, next: NextFunction) {
        try {
            const cards = await cardService.findAllCard();
            res.status(200).json(cards);
        } catch (error) {
            next(new customError(400, `CardController has error: ${error}`));
        }
    }

    public async findByName(req: Request, res: Response, next: NextFunction) {
        try {
            const name = req.params.name;
            const card = await cardService.findByName(name);
            res.status(200).json(card);
        } catch (error) {
            next(new customError(400, `CardController has error: ${error}`));
        }
    }

    public async findCardById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const card = await cardService.findCardById(id);
            res.status(200).json(card);
        } catch (error) {
            next(new customError(400, `CardController has error: ${error}`));
        }
    }

    public async createCard(req: Request, res: Response, next: NextFunction) {
        try {
            const card: Card = req.body;
            const newCard = await cardService.createCard(card);
            res.status(201).json(newCard);
        } catch (error) {
            next(new customError(400, `CardController has error: ${error}`));
        }
    }

    public async updateCard(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const card: Card = req.body;
            const result = await cardService.updateCard(id, card);
            res.status(200).json(result);
        } catch (error) {
            next(new customError(400, `CardController has error: ${error}`));
        }
    }

    public async deleteCard(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await cardService.deleteCard(id);
            res.status(200).json(result);
        } catch (error) {
            next(new customError(400, `CardController has error: ${error}`));
        }
    }

    public async getListCards (req: Request, res: Response, next: NextFunction) {
        try {
            const listId = parseInt(req.params.listId);
            const cards = await cardService.getListCards(listId);
            res.status(200).json(cards);
        } catch (error) {
            next(new customError(400, `CardController has error: ${error}`));
        }
    }

    public async addCardToList (req: Request, res: Response, next: NextFunction) {
        try {
            const cardId = parseInt(req.body.cardId);
            const listId = parseInt(req.body.listId);
            const result = await cardService.addCardToList(cardId, listId);
            res.status(200).json(result);
        } catch (error) {
            next(new customError(400, `CardController has error: ${error}`));
        }
    }

    public async removeCardFromList (req: Request, res: Response, next: NextFunction) {
        try {
            const cardId = parseInt(req.body.cardId);
            const listId = parseInt(req.body.listId);
            const result = await cardService.removeCardFromList(cardId, listId);
            res.status(200).json(result);
        } catch (error) {
            next(new customError(400, `CardController has error: ${error}`));
        }
    }

}

export default new CardController();