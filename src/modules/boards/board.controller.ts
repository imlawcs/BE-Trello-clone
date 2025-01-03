import boardService from "./board.service";
import { Request, Response, NextFunction } from "express";
import customError from "../../common/error/customError";
import { Board } from "../../database/entities/board";
import { Result } from "../../common/response/Result";

class BoardController {
    public async findAllBoard(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await boardService.findAllBoard();
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async findByName(req: Request, res: Response, next: NextFunction) {
        try {
            const name = req.params.name;
            const result = await boardService.findByName(name);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async findByBoardId(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await boardService.findByBoardId(id);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async createBoard(req: Request, res: Response, next: NextFunction) {
        try {
            const board: Board = req.body;
            const userId = parseInt(req.user.id);
            const workspaceId = parseInt(req.body.workspaceId);
            
            const result = await boardService.createBoard(board, workspaceId, userId);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async updateBoard(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const board: Board = req.body;
            const result = await boardService.updateBoard(id, board);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async deleteBoard(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await boardService.deleteBoard(id);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async addListToBoard(req: Request, res: Response, next: NextFunction) {
        try {
            const boardId = parseInt(req.body.boardId);
            const listId = parseInt(req.body.listId);
            const result = await boardService.addListToBoard(boardId, listId);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async removeListFromBoard(req: Request, res: Response, next: NextFunction) {
        try {
            const boardId = parseInt(req.body.boardId);
            const listId = parseInt(req.body.listId);
            const result = await boardService.removeListFromBoard(boardId, listId);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async getBoardLists(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await boardService.getBoardLists(id);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async getBoardUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const result = await boardService.getBoardUsers(id);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async addUserToBoard(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const boardId = parseInt(req.body.boardId);
            const userId = parseInt(req.body.userId);
            const result = await boardService.addUserToBoard(boardId, userId);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async removeUserFromBoard(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const boardId = parseInt(req.body.boardId);
            const userId = parseInt(req.body.userId);
            const result = await boardService.removeUserFromBoard(boardId, userId);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async assignRoleInBoard(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const boardId = parseInt(req.body.boardId);
            const userId = parseInt(req.body.userId);
            const roleId = parseInt(req.body.roleId);
            const result = await boardService.assignRoleInBoard(boardId, userId, roleId);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new BoardController();