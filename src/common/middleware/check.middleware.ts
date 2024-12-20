import { NextFunction, Request, Response } from 'express';
import workspaceRepository from '../../modules/workspace/workspace.repository';
import boardRepository from '../../modules/boards/board.repository';
import customError from '../error/customError';
import listRepository from '../../modules/lists/list.repository';
import cardRepository from '../../modules/cards/card.repository';


class CheckMiddleware {
    public async isBoardInWorkspace(req: Request, res: Response, next: NextFunction) {
        const boardId = Number(req.params.boardId);
        const workspaceId = Number(req.body.workspaceId);

        const board = await workspaceRepository.findBoardOfWorkspace(boardId, workspaceId);
        if(board){
            return next();
        }

        res.status(403).json({
            status: 403,
            message: 'Board is not in this workspace.',
        });
    }

    public async isListInBoard(req: Request, res: Response, next: NextFunction) {
        const listId = Number(req.params.listId);
        const boardId = Number(req.body.boardId);

        const list = await boardRepository.isListInBoard(listId, boardId);
        if(list){
            return next();
        }

        res.status(403).json({
            status: 403,
            message: 'List is not in this board.',
        });
    }

    public async isCardInBoard(req: Request, res: Response, next: NextFunction) {
        const cardId = Number(req.params.cardId);
        const listId = Number(req.body.listId);
        const boardId = Number(req.body.boardId);

        const card = await listRepository.isCardInList(cardId, listId);
        if(card){
            const board = await boardRepository.isListInBoard(boardId, listId);
            if(board){
                return next();
            }
        }

        res.status(403).json({
            status: 403,
            message: 'Card is not in this board.',
        });
    }

    public async isChecklistInBoard(req: Request, res: Response, next: NextFunction) {
        const checklistId = Number(req.params.checklistId);
        const cardId = Number(req.body.cardId);
        const listId = Number(req.body.listId);
        const boardId = Number(req.body.boardId);

        const checklist = await cardRepository.findChecklistInCard(checklistId, cardId);
        if(checklist){
            const card = await listRepository.isCardInList(cardId, listId);
            if(card){
                const board = await boardRepository.isListInBoard(boardId, listId);
                if(board){
                    return next();
                }
            }
        }

        res.status(403).json({
            status: 403,
            message: 'Checklist is not in this board.',
        });
    }
}

export default new CheckMiddleware();