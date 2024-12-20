import { dbSource } from "../../config/ormconfig";
import { Workspace } from "../../database/entities/workspace";
import { User } from "../../database/entities/user";
import { Board } from "../../database/entities/board";
import customError from "../../common/error/customError";
import { any } from "joi";

class WorkspaceRepository {
    private readonly workspaceRepository = dbSource.getRepository(Workspace); 

    public async findAllWorkspace(): Promise<any[]> {
        try {
            const workspaces = await this.workspaceRepository.find({
                select: ["id", "title", "description"],
                relations: ["users"]
            });
            
            return workspaces.map(workspace => ({
                id: workspace.id,
                title: workspace.title,
                description: workspace.description,
                users: workspace.users.map(user => user.username), 
            }));
        } catch (error) {
            throw new customError(400, `WorkspaceRepository has error: ${error}`);
        }
    }    

    public async findByName(name: string): Promise<Workspace | null> {
        try {
            const workspace = await this.workspaceRepository.findOne({
                select: ["id", "title", "description"],
                where: {
                    title: name,
                },
                relations: ["users"],
            });
            workspace?.users.map(user => user.username);
            return workspace;
        }
        catch (error) {
            throw new customError(400, `WorkspaceRepository has error: ${error}`);
        }
    }

    public async findByWorkspaceId(id: number): Promise<Workspace | null> {
        try {
            const workspace = await this.workspaceRepository.findOne({
                select: ["id", "title", "description"],
                where: {
                    id,
                },
                relations: ["users"],
            });
            workspace?.users.map(user => user.username);
            return workspace;
        }
        catch (error) {
            throw new customError(400, `WorkspaceRepository has error: ${error}`);
        }
    }

    public async createWorkspace(workspace: Workspace): Promise<Workspace> {
        try {
            const newWorkspace = await this.workspaceRepository.save(workspace);
            return newWorkspace;
        } catch (error) {
            throw new customError(400, `WorkspaceRepository has error: ${error}`);
        }
    }

    public async updateWorkspace(id: number, workspace: Partial<Workspace>): Promise<void> {
        try {
            await this.workspaceRepository.update(id, workspace);
        } catch (error) {
            throw new customError(400, `WorkspaceRepository has error: ${error}`);
        }
    }

    public async deleteWorkspace(id: number): Promise<void> {
        try {
            await this.workspaceRepository.delete(id);
        } catch (error) {
            throw new customError(400, `WorkspaceRepository has error: ${error}`);
        }
    }

    public async findUserOfWorkspace(workspaceId: number, userId: number): Promise<boolean> {
        try {
            const workspace = await this.workspaceRepository.findOne({
                where: {
                    id: workspaceId,
                },
                relations: ["users"],
            });

            if (!workspace) {
                throw new customError(404, 'Workspace not found');
            }

            workspace.users = workspace.users || [];
            const hasUser = workspace?.users.some((user) => user.id === userId);
            return hasUser;
        } catch (error) {
            throw new customError(400, `WorkspaceRepository has error: ${error}`);
        }
    }

    public async addUserToWorkspace(workspace : Workspace, user : User): Promise<void> {
        try {
            if(!workspace.users) {
                const existingWorkspace = await this.workspaceRepository.findOne({
                    where: { id: workspace.id },
                    relations: ["users"],
                });

                workspace.users = existingWorkspace?.users || [];
            }

            if(workspace.users.some(u => u.id === user.id)) {
                throw new customError(400, 'User already in workspace');
            }
            else {
                workspace.users.push(user);
                await this.workspaceRepository.save(workspace);
            }
        } catch (error) {
            throw new customError(400, `WorkspaceRepository has error: ${error}`);
        }
    }

    public async removeUserFromWorkspace(workspace : Workspace, user : User): Promise<void> {
        try {
            if(!workspace.users) {
                const existingWorkspace = await this.workspaceRepository.findOne({
                    where: { id: workspace.id },
                    relations: ["users"],
                });

                workspace.users = existingWorkspace?.users || [];
            }

            workspace.users = workspace.users.filter(u => u.id !== user.id);
            await this.workspaceRepository.save(workspace);
        } catch (error) {
            throw new customError(400, `WorkspaceRepository has error: ${error}`);
        }
    }

    public async getWorkspaceUsers(workspaceId: number): Promise<any[]> {
        try {
            const workspace = await this.workspaceRepository.findOne({
                where: {
                    id: workspaceId,
                },
                relations: ["users"],
            });
            if (!workspace?.users) {
                throw new customError(404, 'No users found');
            }
            const User : any[] = workspace?.users.map(user => ({
                id: user.id,
                username: user.username,
                email: user.email,
            }));
            return User;
        } catch (error) {
            throw new customError(400, `WorkspaceRepository has error: ${error}`);
        }
    }

    public async getWorkspaceBoards(workspaceId: number): Promise<Board[]> {
        try {
            const workspace = await this.workspaceRepository.findOne({
                where: {
                    id: workspaceId,
                },
                relations: ["boards"],
            });
            if (!workspace?.boards) {
                throw new customError(404, 'No boards found');
            }
            return workspace?.boards || [];
        } catch (error) {
            throw new customError(400, `WorkspaceRepository has error: ${error}`);
        }
    }

    public async findBoardOfWorkspace(workspaceId: number, boardId: number): Promise<boolean> {
        try {
            const workspace = await this.workspaceRepository.findOne({
                where: {
                    id: workspaceId,
                },
                relations: ["boards"],
            });

            if (!workspace) {
                throw new customError(404, 'Workspace not found');
            }

            workspace.boards = workspace.boards || [];
            const hasBoard = workspace?.boards.some((board) => board.id === boardId);
            return hasBoard;
        } catch (error) {
            throw new customError(400, `WorkspaceRepository has error: ${error}`);
        }
    }

    public async addBoardToWorkspace(workspace : Workspace, board : Board): Promise<void> {
        try {
            if(!workspace.boards) {
                const existingWorkspace = await this.workspaceRepository.findOne({
                    where: { id: workspace.id },
                    relations: ["boards"],
                });

                workspace.boards = existingWorkspace?.boards || [];
            }

            if(workspace.boards.some(b => b.id === board.id)) {
                throw new customError(400, 'Board already in workspace');
            }
            else {
                workspace.boards.push(board);
                await this.workspaceRepository.save(workspace);
            }
        } catch (error) {
            throw new customError(400, `WorkspaceRepository has error: ${error}`);
        }
    }

    public async removeBoardFromWorkspace(workspace : Workspace, board : Board): Promise<void> {
        try {
            if(!workspace.boards) {
                const existingWorkspace = await this.workspaceRepository.findOne({
                    where: { id: workspace.id },
                    relations: ["boards"],
                });

                workspace.boards = existingWorkspace?.boards || [];
            }

            workspace.boards = workspace.boards.filter(b => b.id !== board.id);
            await this.workspaceRepository.save(workspace);
        } catch (error) {
            throw new customError(400, `WorkspaceRepository has error: ${error}`);
        }
    }
}

export default new WorkspaceRepository();