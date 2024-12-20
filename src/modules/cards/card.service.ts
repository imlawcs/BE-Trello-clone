import cardRepository from "./card.repository";
import checklistRepository from "../checklists/checklist.repository";
import listService from "../lists/list.service";
import { Result } from "../../common/response/Result";
import customError from "../../common/error/customError";
import { Card } from "../../database/entities/card";
import commentRepository from "../comments/comment.repository";
import attachmentRepository from "../attachments/attachment.repository";
import userRepository from "../users/user.repository";
import{ Attachment } from "../../database/entities/attachment";
import{ Comment } from "../../database/entities/comment";
import{ User } from "../../database/entities/user";


class CardService {
    public async findAllCard(): Promise<Card[]> {
        try {
            const cards = await cardRepository.findAllCard();
            if (cards.length === 0) {
                throw new customError(404, "No cards found");
            }
            return cards;
        } catch (error) {
            throw error;
        }
    }

    public async findByName(name: string): Promise<Card | null> {
        try {
            if (!name) {
                throw new customError(400, "Name is required");
            }
            const card = await cardRepository.findByName(name);
            if (!card) {
                throw new customError(404, `Card ${name} is not found`);
            }
            return card || null;
        } catch (error) {
            throw error;
        }
    }

    public async findCardById(id: number): Promise<Card | null> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            const card = await cardRepository.findCardById(id);
            if (!card) {
                throw new customError(404, `Card ${id} is not found`);
            }
            return card;
        } catch (error) {
            throw error;
        }
    }

    public async createCard(card: Card, listId: number): Promise<Result> {
        try {
            if (!listId) {
                throw new customError(400, "ListId is required");
            }
            const newCard = await cardRepository.createCard(card);
            await listService.addCardToList(newCard.id, listId);
            return new Result(true, 201, `Card ${newCard.id} has been created`, newCard);
        } catch (error) {
            throw error;
        }
    }

    public async updateCard(id: number, card: Card): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            const cardExist = await cardRepository.findCardById(id);
            if (!cardExist) {
                throw new customError(404, `Card ${id} is not found`);
            }
            await cardRepository.updateCard(id, card);
            return new Result(true, 200, `Card ${id} has been updated`);
        } catch (error) {
            throw error;
        }
    }

    public async deleteCard(id: number): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            const cardExist = await cardRepository.findCardById(id);
            if (!cardExist) {
                throw new customError(404, `Card ${id} is not found`);
            }
            await cardRepository.deleteCard(id);
            return new Result(true, 200, `Card ${id} has been deleted`);
        } catch (error) {
            throw error;
        }
    }

    public async getListCards(listId: number): Promise<Card[]> {
        try {
            if (!listId) {
                throw new customError(400, "ListId is required");
            }
            const cards = await cardRepository.getListCards(listId);
            if (cards.length === 0) {
                throw new customError(404, `List ${listId} has no cards`);
            }
            return cards;
        } catch (error) {
            throw error;
        }
    }

    public async addCardToList(cardId: number, listId: number): Promise<Result> {
        try {
            const isCardInList = await cardRepository.findCardInList(cardId, listId);
            if (isCardInList) {
                throw new customError(400, `Card ${cardId} is already in List ${listId}`);
            }
            await cardRepository.addCardToList(cardId, listId);
            return new Result(true, 200, `Card ${cardId} has been added to List ${listId}`);
        } catch (error) {
            throw error;
        }
    }

    public async removeCardFromList(cardId: number, listId: number): Promise<Result> {
        try {
            const isCardInList = await cardRepository.findCardInList(cardId, listId);
            if (!isCardInList) {
                throw new customError(400, `Card ${cardId} is not in List ${listId}`);
            }
            await cardRepository.removeCardFromList(cardId, listId);
            return new Result(true, 200, `Card ${cardId} has been removed from List ${listId}`);
        } catch (error) {
            throw error;
        }
    }

    public async addCommentToCard(cardId: number, commentId: number): Promise<Result> {
        try {
            const cardExist = await cardRepository.findCardById(cardId);
            if (!cardExist) {
                throw new customError(400, `Card ${cardId} is not exist`);
            }

            const commentExist = await commentRepository.findCommentById(commentId);
            if (!commentExist) {
                throw new customError(400, `Comment ${commentId} is not exist`);
            }

            const isCommentInCard = await cardRepository.findCommentInCard(cardId, commentId);
            if (isCommentInCard) {
                throw new customError(400, `Comment ${commentId} is already in Card ${cardId}`);
            }

            await cardRepository.addComment(cardExist, commentExist);
            return new Result(true, 200, `Comment ${commentId} has been added to Card ${cardId}`);
        } catch (error) {
            throw error;
        }
    }

    public async removeCommentFromCard(cardId: number, commentId: number): Promise<Result> {
        try {
            const cardExist = await cardRepository.findCardById(cardId);
            if (!cardExist) {
                throw new customError(400, `Card ${cardId} is not exist`);
            }

            const commentExist = await commentRepository.findCommentById(commentId);
            if (!commentExist) {
                throw new customError(400, `Comment ${commentId} is not exist`);
            }

            const isCommentInCard = await cardRepository.findCommentInCard(commentId, cardId);
            if (!isCommentInCard) {
                throw new customError(400, `Comment ${commentId} is not in Card ${cardId}`);
            }

            await cardRepository.removeComment(cardExist, commentExist);
            return new Result(true, 200, `Comment ${commentId} has been removed from Card ${cardId}`);
        } catch (error) {
            throw error;
        }
    }

    public async addAttachmentToCard(cardId: number, attachmentId: number): Promise<Result> {
        try {
            const cardExist = await cardRepository.findCardById(cardId);
            if (!cardExist) {
                throw new customError(400, `Card ${cardId} is not exist`);
            }

            const attachmentExist = await attachmentRepository.findAttachmentById(attachmentId);
            if (!attachmentExist) {
                throw new customError(400, `Attachment ${attachmentId} is not exist`);
            }

            const isAttachmentInCard = await cardRepository.findAttachmentInCard(attachmentId, cardId);
            if (isAttachmentInCard) {
                throw new customError(400, `Attachment ${attachmentId} is already in Card ${cardId}`);
            }

            await cardRepository.addAttachment(cardExist, attachmentExist);
            return new Result(true, 200, `Attachment ${attachmentId} has been added to Card ${cardId}`);
        } catch (error) {
            throw error;
        }
    }

    public async removeAttachmentFromCard(cardId: number, attachmentId: number): Promise<Result> {
        try {
            const cardExist = await cardRepository.findCardById(cardId);
            if (!cardExist) {
                throw new customError(400, `Card ${cardId} is not exist`);
            }

            const attachmentExist = await attachmentRepository.findAttachmentById(attachmentId);
            if (!attachmentExist) {
                throw new customError(400, `Attachment ${attachmentId} is not exist`);
            }

            const isAttachmentInCard = await cardRepository.findAttachmentInCard(attachmentId, cardId);
            if (!isAttachmentInCard) {
                throw new customError(400, `Attachment ${attachmentId} is not in Card ${cardId}`);
            }

            await cardRepository.removeAttachment(cardExist, attachmentExist);
            return new Result(true, 200, `Attachment ${attachmentId} has been removed from Card ${cardId}`);
        } catch (error) {
            throw error;
        }
    }

    public async assignUserToCard(cardId: number, userId: number): Promise<Result> {
        try {
            const cardExist = await cardRepository.findCardById(cardId);
            if (!cardExist) {
                throw new customError(400, `Card ${cardId} is not exist`);
            }

            const userExist = await userRepository.findByUserId(userId);
            if (!userExist) {
                throw new customError(400, `User ${userId} is not exist`);
            }

            const isUserInCard = await cardRepository.findUserInCard(userId, cardId);
            if (isUserInCard) {
                throw new customError(400, `User ${userId} is already in Card ${cardId}`);
            }

            await cardRepository.assignUser(cardExist, userExist);
            return new Result(true, 200, `User ${userId} has been assigned to Card ${cardId}`);
        }
        catch (error) {
            throw error;
        }
    }

    public async removeUserFromCard(cardId: number, userId: number): Promise<Result> {
        try {
            const cardExist = await cardRepository.findCardById(cardId);
            if (!cardExist) {
                throw new customError(400, `Card ${cardId} is not exist`);
            }

            const userExist = await userRepository.findByUserId(userId);
            if (!userExist) {
                throw new customError(400, `User ${userId} is not exist`);
            }

            const isUserInCard = await cardRepository.findUserInCard(userId, cardId);
            if (!isUserInCard) {
                throw new customError(400, `User ${userId} is not in Card ${cardId}`);
            }

            await cardRepository.removeUser(cardExist, userExist);
            return new Result(true, 200, `User ${userId} has been removed from Card ${cardId}`);
        } catch (error) {
            throw error;
        }
    }

    public async getCardUsers(cardId: number): Promise<User[]> {
        try {
            if (!cardId) {
                throw new customError(400, "CardId is required");
            }
            const users = await cardRepository.getCardUsers(cardId);
            if (users.length === 0) {
                throw new customError(404, `Card ${cardId} has no users`);
            }
            return users;
        } catch (error) {
            throw error;
        }
    }

    public async getCardComments(cardId: number): Promise<Comment[]> {
        try {
            if (!cardId) {
                throw new customError(400, "CardId is required");
            }
            const comments = await cardRepository.getCardComments(cardId);
            if (comments.length === 0) {
                throw new customError(404, `Card ${cardId} has no comments`);
            }
            return comments;
        } catch (error) {
            throw error;
        }
    }

    public async getCardAttachments(cardId: number): Promise<Attachment[]> {
        try {
            if (!cardId) {
                throw new customError(400, "CardId is required");
            }
            const attachments = await cardRepository.getCardAttachments(cardId);
            if (attachments.length === 0) {
                throw new customError(404, `Card ${cardId} has no attachments`);
            }
            return attachments;
        } catch (error) {
            throw error;
        }
    }

    public async getCardChecklists(cardId: number): Promise<any> {
        try {
            if (!cardId) {
                throw new customError(400, "CardId is required");
            }
            const checklists = await cardRepository.getCardChecklists(cardId);
            return checklists;
        } catch (error) {
            throw error;
        }
    }

    public async addChecklistToCard(cardId: number, checklistId: number): Promise<Result> {
        try {
            const cardExist = await cardRepository.findCardById(cardId);
            if (!cardExist) {
                throw new customError(400, `Card ${cardId} is not exist`);
            }

            const checklistExist = await checklistRepository.getChecklistById(checklistId);
            if (!checklistExist) {
                throw new customError(400, `Checklist ${checklistId} is not exist`);
            }

            const isChecklistInCard = await cardRepository.findChecklistInCard(checklistId, cardId);
            if (isChecklistInCard) {
                throw new customError(400, `Checklist ${checklistId} is already in Card ${cardId}`);
            }

            await cardRepository.addChecklistToCard(cardExist, checklistExist);
            return new Result(true, 200, `Checklist ${checklistId} has been added to Card ${cardId}`);
        }
        catch (error) {
            throw error;
        }
    }
}

export default new CardService();
