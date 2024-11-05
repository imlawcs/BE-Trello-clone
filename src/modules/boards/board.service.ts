import boardRepository from "./board.repository";
import { Board } from "../../database/entities/board";
import customError from "../../common/error/customError";
import { Result } from "../../common/response/Result";
import e from "express";

class BoardService {
    public async findAllBoard(): Promise<Result> {
        try {
            const boards = await boardRepository.findAllBoard();
            if (!boards) {
                throw new customError(404, "Boards not found");
            }
            return new Result(true, 200, "Get boards successful", boards);
        } catch (error) {
            throw error;
        }
    }

    public async findByName(name: string): Promise<Result> {
        try {
            if (!name) {
                throw new customError(400, "Name is required");
            }
            const board = await boardRepository.findByName(name);
            if (!board) {
                throw new customError(404, "Board not found");
            }
            return new Result(true, 200, "Get board by name successful", board);
        }
        catch (error) {
            throw error;
        }
    }

    public async findByBoardId(id: number): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            const board = await boardRepository.findByBoardId(id);
            if (!board) {
                throw new customError(404, "Board not found");
            }
            return new Result(true, 200, "Get board by id successful", board);
        }
        catch (error) {
            throw error;
        }
    }

    public async createBoard(board: Board): Promise<Result> {
        try {
            if (!board) {
                throw new customError(400, "Board is required");
            }
            await boardRepository.createBoard(board);
            return new Result(true, 201, "Create board successful", board);
        } catch (error) {
            throw error;
        }
    }

    public async updateBoard(id: number, board: Board): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            if (!board) {
                throw new customError(400, "Board is required");
            }
            await boardRepository.updateBoard(id, board);
            return new Result(true, 200, "Update board successful", board);
        } catch (error) {
            throw error;
        }
    }

    public async deleteBoard(id: number): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            await boardRepository.deleteBoard(id);
            return new Result(true, 200, "Delete board successful");
        } catch (error) {
            throw error;
        }
    }

    public async getBoardLists(id: number): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            const lists = await boardRepository.getBoardLists(id);
            if (!lists) {
                throw new customError(404, "Lists not found");
            }
            return new Result(true, 200, "Get board lists successful", lists);
        } catch (error) {
            throw error;
        }
    }

    public async addListToBoard(id: number, listId: number): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            if (!listId) {
                throw new customError(400, "List id is required");
            }
            await boardRepository.addListToBoard(id, listId);
            return new Result(true, 200, "Add list to board successful");
        } catch (error) {
            throw error;
        }
    }

    public async removeListFromBoard(id: number, listId: number): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, "Id is required");
            }
            if (!listId) {
                throw new customError(400, "List id is required");
            }
            await boardRepository.removeListFromBoard(id, listId);
            return new Result(true, 200, "Remove list from board successful");
        } catch (error) {
            throw error;
        }
    }
}

export default new BoardService();