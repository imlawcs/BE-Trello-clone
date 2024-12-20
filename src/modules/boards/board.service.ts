import boardRepository from "./board.repository";
import listRepository from "../lists/list.repository";
import workspaceService from "../workspace/workspace.service";
import { Board } from "../../database/entities/board";
import userRepository from "../users/user.repository";
import customError from "../../common/error/customError";
import { Result } from "../../common/response/Result";
import e from "express";

class BoardService {
    public async findAllBoard(): Promise<Result> {
        try {
            const boards = await boardRepository.findAllBoard();
            if (boards.length === 0) {
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

    public async createBoard(board: Board, workspaceId: number): Promise<Result> {
        try {
            if (!workspaceId) {
                throw new customError(400, "Workspace id is required");
            }
            if (!board) {
                throw new customError(400, "Board is required");
            }
            const newBoard = await boardRepository.createBoard(board);
            await workspaceService.addBoardToWorkspace(workspaceId, newBoard.id);
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
            return new Result(true, 200, "Update board successful");
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
            if (lists.length === 0) {
                throw new customError(404, "Lists not found");
            }
            return new Result(true, 200, "Get board lists successful", lists);
        } catch (error) {
            throw error;
        }
    }

    public async addListToBoard(boardId: number, listId: number): Promise<Result> {
        try {
            if (!boardId) {
                throw new customError(400, "Board id is required");
            }
            if (!listId) {
                throw new customError(400, "List id is required");
            }
            const boardExist = await boardRepository.findByBoardId(boardId);
            if (!boardExist) {
                throw new customError(404, "Board not found");
            }
            const listExist = await listRepository.findByListId(listId);
            if (!listExist) {
                throw new customError(404, "List not found");
            }
            const isListInBoard = await boardRepository.isListInBoard(listId, boardId);
            await boardRepository.addListToBoard(boardId, listId);
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

    public async getBoardUsers (id: number): Promise<Result> {
        try {
            if(!id) {
                throw new customError(400, 'Id is required')
            }
            const users = await boardRepository.getBoardUsers(id);
            if(users.length === 0) {
                throw new customError(404, "Users not found")
            }
            return new Result(true, 200, "Get board users successful", users);
        } catch (error) {
            throw error;
        }
    }

    public async addUserToBoard(userId: number, boardId: number): Promise<Result> {
        try {
            if (!userId) {
                throw new customError(400, "User id is required");
            }
            if (!boardId) {
                throw new customError(400, "Board id is required");
            }
            const boardExist = await boardRepository.findByBoardId(boardId);
            if (!boardExist) {
                throw new customError(404, "Board not found");
            }
            const userExist = await userRepository.findByUserId(userId);
            if (!userExist) {
                throw new customError(404, "User not found");
            }
            await boardRepository.addUserToBoard(userId, boardId);
            return new Result(true, 200, "Add user to board successful");
        } catch (error) {
            throw error;
        }
    }

    public async findUserInBoard(userId: number, boardId: number): Promise<boolean> {
        try {
            if (!userId) {
                throw new customError(400, "User id is required");
            }
            if (!boardId) {
                throw new customError(400, "Board id is required");
            }
            const userInBoard = await boardRepository.isUserInBoard(userId, boardId);
            if (!userInBoard) {
                return false;
            }
            return true;
        } catch (error) {
            throw error;
        }

    }

    public async removeUserFromBoard(userId: number, boardId: number): Promise<Result> {
        try {
            if (!userId) {
                throw new customError(400, "User id is required");
            }
            if (!boardId) {
                throw new customError(400, "Board id is required");
            }
            const boardExist = await boardRepository.findByBoardId(boardId);
            if (!boardExist) {
                throw new customError(404, "Board not found");
            }
            const userExist = await userRepository.findByUserId(userId);
            if (!userExist) {
                throw new customError(404, "User not found");
            }
            await boardRepository.removeUserFromBoard(userId, boardId);
            return new Result(true, 200, "Remove user from board successful");
        } catch (error) {
            throw error;
        }
    }
}

export default new BoardService();