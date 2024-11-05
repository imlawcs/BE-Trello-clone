import { dbSource } from "../../config/ormconfig";
import { Board } from "../../database/entities/board";
import customError from "../../common/error/customError";

class BoardRepository {
    private readonly boardRepository = dbSource.getRepository(Board);

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

    public async createBoard(board : Board): Promise<Board> {
        try {
            await this.boardRepository.save(board);
            return board;
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
            await this.boardRepository.save(board);
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
}

export default new BoardRepository();