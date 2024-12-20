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
            next(error);
        }
    }

    public async findByName(req: Request, res: Response, next: NextFunction) {
        try {
            const name = req.params.name;
            const card = await cardService.findByName(name);
            res.status(200).json(card);
        } catch (error) {
            next(error);
        }
    }

    public async findCardById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const card = await cardService.findCardById(id);
            res.status(200).json(card);
        } catch (error) {
            next(error);
        }
    }

    public async createCard(req: Request, res: Response, next: NextFunction) {
        try {
            const card: Card = req.body;
            const listId = parseInt(req.body.listId);
            const result = await cardService.createCard(card, listId);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async updateCard(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const card: Card = req.body;
            const result = await cardService.updateCard(id, card);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async deleteCard(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await cardService.deleteCard(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async getListCards (req: Request, res: Response, next: NextFunction) {
        try {
            const listId = parseInt(req.params.listId);
            const cards = await cardService.getListCards(listId);
            res.status(200).json(cards);
        } catch (error) {
            next(error);
        }
    }

    public async addCardToList (req: Request, res: Response, next: NextFunction) {
        try {
            const cardId = parseInt(req.body.cardId);
            const listId = parseInt(req.body.listId);
            const result = await cardService.addCardToList(cardId, listId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async removeCardFromList (req: Request, res: Response, next: NextFunction) {
        try {
            const cardId = parseInt(req.body.cardId);
            const listId = parseInt(req.body.listId);
            const result = await cardService.removeCardFromList(cardId, listId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async assignUser (req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.body.userId);
            const cardId = parseInt(req.body.cardId);
            const result = await cardService.assignUserToCard(cardId, userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async removeUser (req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.body.userId);
            const cardId = parseInt(req.body.cardId);
            const result = await cardService.removeUserFromCard(cardId, userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async addComment (req: Request, res: Response, next: NextFunction) {
        try {
            const commentId = parseInt(req.body.commentId);
            const cardId = parseInt(req.body.cardId);
            const result = await cardService.addCommentToCard(cardId, commentId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async removeComment (req: Request, res: Response, next: NextFunction) {
        try {
            const commentId = parseInt(req.body.commentId);
            const cardId = parseInt(req.body.cardId);
            const result = await cardService.removeCommentFromCard(cardId, commentId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async addAttachment (req: Request, res: Response, next: NextFunction) {
        try {
            const attachmentId = parseInt(req.body.attachmentId);
            const cardId = parseInt(req.body.cardId);
            const result = await cardService.addAttachmentToCard(cardId, attachmentId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async removeAttachment (req: Request, res: Response, next: NextFunction) {
        try {
            const attachmentId = parseInt(req.body.attachmentId);
            const cardId = parseInt(req.body.cardId);
            const result = await cardService.removeAttachmentFromCard(cardId, attachmentId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async getCardUsers (req: Request, res: Response, next: NextFunction) {
        try {
            const cardId = parseInt(req.params.cardId);
            const users = await cardService.getCardUsers(cardId);
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    public async getCardComments (req: Request, res: Response, next: NextFunction) {
        try {
            const cardId = parseInt(req.params.cardId);
            const comments = await cardService.getCardComments(cardId);
            res.status(200).json(comments);
        } catch (error) {
            next(error);
        }
    }

    public async getCardAttachments (req: Request, res: Response, next: NextFunction) {
        try {
            const cardId = parseInt(req.params.cardId);
            const attachments = await cardService.getCardAttachments(cardId);
            res.status(200).json(attachments);
        } catch (error) {
            next(error);
        }
    }
}

export default new CardController();