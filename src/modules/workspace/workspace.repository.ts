import { dbSource } from "../../config/ormconfig";
import { Workspace } from "../../database/entities/workspace";
import { User } from "../../database/entities/user";
import { Board } from "../../database/entities/board";
import customError from "../../common/error/customError";

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

    public async updateWorkspace(workspace: Partial<Workspace>): Promise<Workspace> {
        try {
            const updatedWorkspace = await this.workspaceRepository.save(workspace);
            return updatedWorkspace;
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

    public async getWorkspaceUsers(workspaceId: number): Promise<User[]> {
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
            return workspace?.users;
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
}

export default new WorkspaceRepository();