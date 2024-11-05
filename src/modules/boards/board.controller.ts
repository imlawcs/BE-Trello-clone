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
            const result = await boardService.createBoard(board);
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
            const boardId = parseInt(req.params.boardId);
            const listId = parseInt(req.params.listId);
            const result = await boardService.addListToBoard(boardId, listId);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async removeListFromBoard(req: Request, res: Response, next: NextFunction) {
        try {
            const boardId = parseInt(req.params.boardId);
            const listId = parseInt(req.params.listId);
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
}

export default new BoardController();