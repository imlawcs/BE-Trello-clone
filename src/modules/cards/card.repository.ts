import { dbSource } from "../../config/ormconfig";
import { Card } from "../../database/entities/card";
import customError from "../../common/error/customError";
import { List } from "../../database/entities/list";
import { Result } from "../../common/response/Result";
import { User } from "../../database/entities/user";
import { Checklist } from "../../database/entities/checklist";
// import { Label } from "../../database/entities/label";
import { Comment } from "../../database/entities/comment";
import { Attachment } from "../../database/entities/attachment";

import { ActivityLog } from "../../database/entities/activitylog";
import activityService from "../activitylogs/activity.service";
import { Activity } from "../../common/types/activitylog.enum";
import { Board } from "../../database/entities/board";

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

    public async createCard(card: Card, board: Board, user: User): Promise<Card> {
        try {
            const newCard = await dbSource.getRepository(Card).save(card);
            const activityLog = {
                action: Activity.CREATE_CARD,
                description: `User ${user.username} created card ${newCard.title}`,
                card: newCard,
                board: board,
                user: user
            }
            await activityService.createActivity(activityLog);
            return newCard;
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async updateCard(id: number, card: Partial<Card>, user: User, board: Board): Promise<void> {
        try {
            await dbSource.getRepository(Card).update(id, card);
            const updatedCard = await this.findCardById(id);
            if (!updatedCard) {
                throw new customError(400, `Card not found`);
            }
            const activityLog = {
                action: Activity.UPDATE_CARD,
                description: `User ${user.username} updated card ${updatedCard.title}`,
                card: updatedCard,
                board: board,
                user: user
            }
            await activityService.createActivity(activityLog);
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async deleteCard(id: number, user: User, board: Board): Promise<void> {
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
            const activityLog = {
                action: Activity.DELETE_CARD,
                description: `User ${user.username} deleted card ${card.title}`,
                card: card,
                board: board,
                user: user
            }
            await activityService.createActivity(activityLog);
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

    public async assignUser(card: Card, user: User): Promise<void> {
        try {
            if (!card.users) {
                const cardWithUsers = await dbSource.getRepository(Card).findOne({
                    where: {
                        id: card.id,
                    },
                    relations: ["users"],
                });
                card.users = cardWithUsers?.users || [];
            }

            if(!card.users.some(u => u.id === user.id)) {
                card.users.push(user);
                await dbSource.getRepository(Card).save(card);
            }
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async removeUser(card: Card, user: User): Promise<void> {
        try {
            if (!card.users) {
                const cardWithUsers = await dbSource.getRepository(Card).findOne({
                    where: {
                        id: card.id,
                    },
                    relations: ["users"],
                });
                card.users = cardWithUsers?.users || [];
            }
            
            card.users = card.users.filter((u) => u.id !== user.id);
            await dbSource.getRepository(Card).save(card);
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    // public async addLabel(card: Card, labelId: number): Promise<void> {
    //     try {
    //         card.labels.push(labelId);
    //         await dbSource.getRepository(Card).save(card);
    //     } catch (error) {
    //         throw new customError(400, `CardRepository has error: ${error}`);
    //     }
    // }

    // public async removeLabel(card: Card, labelId: number): Promise<void> {
    //     try {
    //         card.labels = card.labels.filter((l) => l !== labelId);
    //         await dbSource.getRepository(Card).save(card);
    //     } catch (error) {
    //         throw new customError(400, `CardRepository has error: ${error}`);
    //     }
    // }

    public async addComment(card: Card, comment: Comment, user: User, board: Board): Promise<void> {
        try {
            if(!card.comments) {
                const cardWithComments = await dbSource.getRepository(Card).findOne({
                    where: {
                        id: card.id,
                    },
                    relations: ["comments"],
                });
                card.comments = cardWithComments?.comments || [];
            }

            if(!card.comments.some(c => c.id === comment.id)) {
                card.comments.push(comment);
                await dbSource.getRepository(Card).save(card);

                const activityLog = {
                    action: Activity.ADD_COMMENT,
                    description: `User ${user.username} added comment to card ${card.title}`,
                    card: card,
                    board: board,
                    user: user
                }
                await activityService.createActivity(activityLog);
            }
        } catch (error) {            
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async removeComment(card: Card, comment: Comment): Promise<void> {
        try {
            if(!card.comments) {
                const cardWithComments = await dbSource.getRepository(Card).findOne({
                    where: {
                        id: card.id,
                    },
                    relations: ["comments"],
                });
                card.comments = cardWithComments?.comments || [];
            }
            
            card.comments = card.comments.filter((c) => c.id !== comment.id);
            await dbSource.getRepository(Card).save(card);
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async getCardComments(cardId: number): Promise<Comment[]> {
        try {
            const card = await dbSource.getRepository(Card).findOne({
                where: {
                    id: cardId,
                },
                relations: ["comments"],
            });
            if (!card) {
                throw new customError(400, `Card not found`);
            }
            return card.comments;
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async findCommentInCard(cardId: number, commentId: number): Promise<Comment | null> {
        try {
            const card = await this.findCardById(cardId);            
            
            if (!card) {
                throw new customError(400, `Card not found`);
            }

            if(!card.comments) {
                const cardWithComments = await dbSource.getRepository(Card).findOne({
                    where: {
                        id: card.id,
                    },
                    relations: ["comments"],
                });
                card.comments = cardWithComments?.comments || [];
            }

            const comment = card.comments.find((c) => c.id === commentId);
            return comment || null;
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async getCardUsers(cardId: number): Promise<User[]> {
        try {
            const card = await dbSource.getRepository(Card).findOne({
                where: {
                    id: cardId,
                },
                relations: ["users"],
            });
            if (!card) {
                throw new customError(400, `Card not found`);
            }
            return card.users;
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async findAttachmentInCard(cardId: number, attachmentId: number): Promise<Attachment | null> {
        try {
            const card = await dbSource.getRepository(Card).findOne({
                where: {
                    id: cardId,
                },
                relations: ["attachments"],
            });
            
            if (!card) {
                throw new customError(400, `Card not found`);
            }

            const attachment = card.attachments.find((a) => a.id === attachmentId);
            return attachment || null;
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async findUserInCard(cardId: number, userId: number): Promise<User | null> {
        try {
            const card = await dbSource.getRepository(Card).findOne({
                where: {
                    id: cardId,
                },
                relations: ["users"],
            });
            if (!card) {
                throw new customError(400, `Card not found`);
            }

            const user = card.users.find((u) => u.id === userId);
            return user || null;
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async getCardAttachments(cardId: number): Promise<Attachment[]> {
        try {
            const card = await dbSource.getRepository(Card).findOne({
                where: {
                    id: cardId,
                },
                relations: ["attachments"],
            });
            if (!card) {
                throw new customError(400, `Card not found`);
            }
            return card.attachments;
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async addAttachment(card: Card, attachment: Attachment): Promise<void> {
        try {
            if(!card.attachments) {
                const cardWithAttachments = await dbSource.getRepository(Card).findOne({
                    where: {
                        id: card.id,
                    },
                    relations: ["attachments"],
                });
                card.attachments = cardWithAttachments?.attachments || [];
            }

            if(!card.attachments.some(a => a.id === attachment.id)) {
                card.attachments.push(attachment);
                await dbSource.getRepository(Card).save(card);
            }
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async removeAttachment(card: Card, attachment: Attachment): Promise<void> {
        try {
            if(!card.attachments) {
                const cardWithAttachments = await dbSource.getRepository(Card).findOne({
                    where: {
                        id: card.id,
                    },
                    relations: ["attachments"],
                });
                card.attachments = cardWithAttachments?.attachments || [];
            }

            card.attachments = card.attachments.filter((a) => a.id !== attachment.id);
            await dbSource.getRepository(Card).save(card);
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    // public async addChecklist(card: Card, checklistId: number): Promise<void> {
    //     try {
    //         card.checklists.push(checklistId);
    //         await dbSource.getRepository(Card).save(card);
    //     } catch (error) {
    //         throw new customError(400, `CardRepository has error: ${error}`);
    //     }
    // }

    // public async removeChecklist(card: Card, checklistId: number): Promise<void> {
    //     try {
    //         card.checklists = card.checklists.filter((c) => c !== checklistId);
    //         await dbSource.getRepository(Card).save(card);
    //     } catch (error) {
    //         throw new customError(400, `CardRepository has error: ${error}`);
    //     }
    // }

    public async getCardChecklists(cardId: number): Promise<Result> {
        try {
            const card = await dbSource.getRepository(Card).findOne({
                where: {
                    id: cardId,
                },
                relations: ["checklists"],
            });
            if (!card) {
                throw new customError(404, `Card have no checklist`);
            }
            return new Result(true, 200, "get check list successful", card.checklists);
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async findChecklistInCard(cardId: number, checklistId: number): Promise<Result> {
        try {
            const card = await dbSource.getRepository(Card).findOne({
                where: {
                    id: cardId,
                },
                relations: ["checklists"],
            });
            if (!card) {
                throw new customError(400, `Card not found`);
            }

            const checklist = card.checklists.find((c) => c.id === checklistId);
            return new Result(true, 200, "get check list successful", checklist);
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async addChecklistToCard(card: Card, checklist: Checklist): Promise<void> {
        try {
            if(!card.checklists) {
                const cardWithChecklists = await dbSource.getRepository(Card).findOne({
                    where: {
                        id: card.id,
                    },
                    relations: ["checklists"],
                });
                card.checklists = cardWithChecklists?.checklists || [];
            }

            if(!card.checklists.some(c => c.id === checklist.id)) {
                card.checklists.push(checklist);
                await dbSource.getRepository(Card).save(card);
            }
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }

    public async removeChecklistFromCard(card: Card, checklist: Checklist): Promise<void> {
        try {
            if(!card.checklists) {
                const cardWithChecklists = await dbSource.getRepository(Card).findOne({
                    where: {
                        id: card.id,
                    },
                    relations: ["checklists"],
                });
                card.checklists = cardWithChecklists?.checklists || [];
            }

            card.checklists = card.checklists.filter((c) => c.id !== checklist.id);
            await dbSource.getRepository(Card).save(card);
        } catch (error) {
            throw new customError(400, `CardRepository has error: ${error}`);
        }
    }
}

export default new CardRepository();