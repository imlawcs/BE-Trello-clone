import { dbSource } from "../../config/ormconfig";
import { Board } from "../../database/entities/board";
import customError from "../../common/error/customError";
import { List } from "../../database/entities/list";
import { User } from "../../database/entities/user";
import { UserBoard } from "../../database/entities/user_board";
import { Role } from "../../database/entities/role";
import { ActivityLog } from "../../database/entities/activitylog";
import activityService from "../activitylogs/activity.service";
import { Activity } from "../../common/types/activitylog.enum";

class BoardRepository {
    private readonly boardRepository = dbSource.getRepository(Board);
    private readonly userBoardRepository = dbSource.getRepository(UserBoard);

    public async findAllBoard(): Promise<Board[]> {
        try {
            const boards = await this.boardRepository.find({
                select: ["id", "title", "description"],
                relations: ["lists"],
            });
            
            return boards.map(board => ({
                id: board.id,
                title: board.title,
                description: board.description,
                lists: board.lists,
                workspace: board.workspace,
                activityLogs: board.activityLogs,
                users: board.users
            }));
        } catch (error) {
            throw new customError(400, `BoardRepository has error: ${error}`);
        }
    }    

    public async findByName(name: string): Promise<Board | null> {
        try {
            const board = await this.boardRepository.findOne({
                select: ["id", "title", "description"],
                where: {
                    title: name,
                },
                relations: ["lists"],
            });
            return board;
        }
        catch (error) {
            throw new customError(400, `BoardRepository has error: ${error}`);
        }
    }

    public async findByBoardId(id: number): Promise<Board | null> {
        try {
            const board = await this.boardRepository.findOne({
                select: ["id", "title", "description"],
                where: {
                    id,
                },
                relations: ["lists"],
            });
            return board;
        }
        catch (error) {
            throw new customError(400, `BoardRepository has error: ${error}`);
        }
    }

    public async createBoard(board : Board, userId: number): Promise<Board> {
        try {
            const role = await dbSource.getRepository(Role).findOne({
                where: {
                    name: 'owner of board'
                }
            })
            
            if (!role) {
                throw new customError(404, "Role not found");
            }

            const user = await dbSource.getRepository(User).findOne({
                where: {
                    id: userId
                }
            });

            if (!user) {
                throw new customError(404, "User not found");
            }

            const newBoard : Board = await this.boardRepository.save(board);

            const userBoard = {
                user: user,
                board: newBoard,
                role: role
            }

            await this.userBoardRepository.save(userBoard);

            const activityLog = {
                action: Activity.CREATE_BOARD,
                description: `User ${user.username} created board ${newBoard.title}`,
                user: user,
                board: newBoard
            }
            await activityService.createActivity(activityLog);

            return newBoard;
        } catch (error) {
            throw new customError(400, `BoardRepository has error: ${error}`);
        }
    }

    public async updateBoard(boardId: number, board : Partial<Board>): Promise<void> {
        try {
            const boardExist = await this.boardRepository.findOne({
                where: {
                    id: boardId,
                },
            });
            if (!boardExist)
                throw new customError(400, `BoardRepository has error: Board does not exist`);            
            await this.boardRepository.update(boardId, board);

            const activityLog = {
                action: Activity.UPDATE_BOARD,
                description: `Board ${boardExist.title} updated`,
                user: boardExist.users[0],
                board: boardExist
            }
            await activityService.createActivity(activityLog);
        } catch (error) {
            throw new customError(400, `BoardRepository has error: ${error}`);
        }
    }

    public async deleteBoard(id: number): Promise<void> {
        try {
            const board = await this.boardRepository.findOne({
                where: {
                    id,
                },
            });
            if (!board) {
                throw new customError(400, `BoardRepository has error: Board does not exist`);
            }
            await this.boardRepository.remove(board);
        } catch (error) {
            throw new customError(400, `BoardRepository has error: ${error}`);
        }
    }

    public async getBoardLists(id: number): Promise<List[]> {
        try {
            const board = await this.boardRepository.findOne({
                select: ["id", "title", "description"],
                where: {
                    id,
                },
                relations: ["lists"],
            });
            if (!board) {
                throw new customError(400, `BoardRepository has error: Board does not exist`);
            }
            if (!board.lists) {
                throw new customError(400, `BoardRepository has error: Board does not have any list`);
            }
            return board.lists;
        }
        catch (error) {
            throw new customError(400, `BoardRepository has error: ${error}`);
        }
    }

    public async getBoardUsers(id: number): Promise<User[]> {
        try {
            const board = await this.boardRepository.findOne({
                select: ["id", "title", "description"],
                where: {
                    id,
                },
                relations: ["users"]
            })
            if (!board) {
                throw new customError(400, `BoardRepository has error: Board does not exist`);
            }
            if (!board.users) {
                throw new customError(400, `BoardRepository has error: Board does not have any user`);
            }
            return board.users;
        }
        catch (error) {
            throw new customError(400, `BoardRepository has error: ${error}`)
        }
    }

    public async isListInBoard(listId: number, boardId: number): Promise<boolean> {
        try {
            const board = await this.boardRepository.findOne({
                where: {
                    id: boardId,
                },
                relations: ["lists"],
            });
            if (!board) {
                throw new customError(400, `BoardRepository has error: Board does not exist`);
            }
            const list = await dbSource.getRepository(List).findOne({
                where: {
                    id: listId,
                },
            });
            if (!list) {
                throw new customError(400, `BoardRepository has error: List does not exist`);
            }
            return board.lists.some(item => item.id === listId);
        } catch (error) {
            throw new customError(400, `BoardRepository has error: ${error}`);
        }
    }

    public async addListToBoard(boardId: number, listId: number): Promise<void> {
        try {
            const board = await this.boardRepository.findOne({
                where: {
                    id: boardId,
                },
                relations: ["lists"],
            });
            if (!board) {
                throw new customError(400, `BoardRepository has error: Board does not exist`);
            }
            const list = await dbSource.getRepository(List).findOne({
                where: {
                    id: listId,
                },
            });
            if (!list) {
                throw new customError(400, `BoardRepository has error: List does not exist`);
            }

            const isListInBoard = await this.isListInBoard(listId, boardId);
            if (isListInBoard) {
                throw new customError(400, 'List is already in board');
            }

            board.lists.push(list);
            await this.boardRepository.save(board);
        } catch (error) {
            throw new customError(400, `BoardRepository has error: ${error}`);
        }
    }

    public async removeListFromBoard(boardId: number, listId: number): Promise<void> {
        try {
            const board = await this.boardRepository.findOne({
                where: {
                    id: boardId,
                },
                relations: ["lists"],
            });
            if (!board) {
                throw new customError(400, `BoardRepository has error: Board does not exist`);
            }
            const list = await dbSource.getRepository(List).findOne({
                where: {
                    id: listId,
                },
            });
            if (!list) {
                throw new customError(400, `BoardRepository has error: List does not exist`);
            }

            const isListInBoard = await this.isListInBoard(listId, boardId);
            if(!isListInBoard) {
                throw new customError(400, 'List is not in board')
            }

            board.lists = board.lists.filter(item => item.id !== listId);
            await this.boardRepository.save(board);
        } catch (error) {
            throw new customError(400, `BoardRepository has error: ${error}`);
        }
    }

    public async isUserInBoard(userId: number, boardId: number): Promise<boolean> {
        try {
            const board = await this.boardRepository.findOne({
                where: {
                    id: boardId,
                },
                relations: ["users"],
            });
            if (!board) {
                throw new customError(400, `BoardRepository has error: Board does not exist`);
            }
            const user = await dbSource.getRepository(User).findOne({
                where: {
                    id: userId,
                },
            });
            if (!user) {
                throw new customError(400, `BoardRepository has error: User does not exist`);
            }
            return board.users.some(item => item.id === userId);
        } catch (error) {
            throw new customError(400, `BoardRepository has error: ${error}`);
        }
    }

    public async addUserToBoard(userId: number, boardId: number): Promise<void> {
        try {
            const board = await this.boardRepository.findOne({
                where: {
                    id: boardId,
                },
                relations: ["users"],
            });
            if (!board) {
                throw new customError(400, `BoardRepository has error: Board does not exist`);
            }
            const user = await dbSource.getRepository(User).findOne({
                where: {
                    id: userId,
                },
            });
            if (!user) {
                throw new customError(400, `BoardRepository has error: User does not exist`);
            }

            const isUserInBoard = await this.isUserInBoard(userId, boardId);
            if(isUserInBoard) {
                throw new customError(400, 'User is already in board');
            }

            const role = await dbSource.getRepository(Role).findOne({
                where: {
                    name: 'member of board'
                }
            });
            if (!role) {
                throw new customError(400, `BoardRepository has error: Role does not exist`);
            }

            board.users.push(user);

            const userBoard = this.userBoardRepository.create({
                board: board,
                user: user,
                role: role
            });

            await this.userBoardRepository.save(userBoard);
            await this.boardRepository.save(board);

            const activityLog = {
                action: Activity.ADD_USER_TO_BOARD,
                description: `User ${user.username} added to board ${board.title}`,
                user: user,
                board: board
            }
            await activityService.createActivity(activityLog);
        } catch (error) {
            throw new customError(400, `BoardRepository has error: ${error}`);
        }
    }

    public async removeUserFromBoard(userId: number, boardId: number): Promise<void> {
        try {
            const board = await this.boardRepository.findOne({
                where: {
                    id: boardId,
                },
                relations: ["users"],
            });
            if (!board) {
                throw new customError(400, `BoardRepository has error: Board does not exist`);
            }
            const user = await dbSource.getRepository(User).findOne({
                where: {
                    id: userId,
                },
            });
            if (!user) {
                throw new customError(400, `BoardRepository has error: User does not exist`);
            }

            const isUserInBoard = await this.isUserInBoard(userId, boardId);
            if(!isUserInBoard) {
                throw new customError(400, 'User is not in board')
            }

            const userBoard = await this.userBoardRepository.findOne({
                where: {
                    board: board,
                    user: user
                }
            });
            if (!userBoard) {
                throw new customError(400, `BoardRepository has error: UserBoard does not exist`);
            }

            await this.userBoardRepository.remove(userBoard);

            board.users = board.users.filter(item => item.id !== userId);
            await this.boardRepository.save(board);

            const activityLog = {
                action: Activity.REMOVE_USER_FROM_BOARD,
                description: `User ${user.username} removed from board ${board.title}`,
                user: user,
                board: board
            }
            await activityService.createActivity(activityLog);
        } catch (error) {
            throw new customError(400, `BoardRepository has error: ${error}`);
        }
    }

    public async assignRoleInBoard(user: User, board: Board, role: Role): Promise<void> {
        try {
            const userBoard = await this.userBoardRepository.findOne({
                where: {
                    user: user,
                    board: board
                }
            });
            if (!userBoard) {
                throw new customError(400, `BoardRepository has error: UserBoard does not exist`);
            }

            userBoard.role = role;
            await this.userBoardRepository.save(userBoard);

            const activityLog = {
                action : Activity.ASSIGN_ROLE_IN_BOARD,
                description: `Role ${role.name} assigned to user ${user.username} in board ${board.title}`,
                user: user,
                board: board
            }
            await activityService.createActivity(activityLog);
        } catch (error) {
            throw new customError(400, `BoardRepository has error: ${error}`);
        }
    }
}

export default new BoardRepository();