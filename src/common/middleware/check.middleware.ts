import { NextFunction, Request, Response } from 'express';
import workspaceRepository from '../../modules/workspace/workspace.repository';
import boardRepository from '../../modules/boards/board.repository';
import customError from '../error/customError';
import listRepository from '../../modules/lists/list.repository';
import cardRepository from '../../modules/cards/card.repository';

class CheckMiddleware {
    public async isBoardInWorkspace(req: Request, res: Response, next: NextFunction) {
        try {
            const boardId = Number(req.params.id);
            const workspaceId = Number(req.body.workspaceId);

            const board = await workspaceRepository.findBoardOfWorkspace(workspaceId, boardId);
            if (board) {
                return next();
            }

            throw new customError(403, 'Board is not in this workspace.');
        } catch (err) {
            next(err);
        }
    }

    public async isListInBoard(req: Request, res: Response, next: NextFunction) {
        try {
            const listId = Number(req.params.id);
            const boardId = Number(req.body.boardId);

            const list = await boardRepository.isListInBoard(listId, boardId);
            if (list) {
                return next();
            }

            throw new customError(403, 'List is not in this board.');
        } catch (err) {
            next(err);
        }
    }

    public async isCardInBoard(req: Request, res: Response, next: NextFunction) {
        try {
            const cardId = Number(req.params.id);
            const listId = Number(req.body.listId);
            const boardId = Number(req.body.boardId);

            const cardExist = await cardRepository.findCardById(cardId);
            if (!cardExist) {
                throw new customError(404, 'Card not found.');
            }

            const listExist = await listRepository.findByListId(listId);
            if (!listExist) {
                throw new customError(404, 'List not found.');
            }

            const card = await listRepository.isCardInList(listExist, cardExist);
            if (card) {
                const board = await boardRepository.isListInBoard(boardId, listId);
                if (board) {
                    return next();
                }
            }

            throw new customError(403, 'Card is not in this board.');
        } catch (err) {
            next(err);
        }
    }

    public async isChecklistInBoard(req: Request, res: Response, next: NextFunction) {
        try {
            const checklistId = Number(req.params.id);
            const cardId = Number(req.body.cardId);
            const listId = Number(req.body.listId);
            const boardId = Number(req.body.boardId);

            const cardExist = await cardRepository.findCardById(cardId);
            if (!cardExist) {
                throw new customError(404, 'Card not found.');
            }

            const listExist = await listRepository.findByListId(listId);
            if (!listExist) {
                throw new customError(404, 'List not found.');
            }

            const checklist = await cardRepository.findChecklistInCard(checklistId, cardId);
            if (checklist) {
                const card = await listRepository.isCardInList(listExist, cardExist);
                if (card) {
                    const board = await boardRepository.isListInBoard(boardId, listId);
                    if (board) {
                        return next();
                    }
                }
            }

            throw new customError(403, 'Checklist is not in this board.');
        } catch (err) {
            next(err);
        }
    }
}

export default new CheckMiddleware();
