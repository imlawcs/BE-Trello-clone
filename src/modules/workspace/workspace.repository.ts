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
                relations: ["users"], 
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

    public async updateWorkspace(workspace: Workspace): Promise<Workspace> {
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

    public async addUserToWorkspace(workspaceId: number, userId: number): Promise<void> {
        try {
            await this.workspaceRepository.createQueryBuilder()
                .relation(Workspace, "users")
                .of(workspaceId)
                .add(userId);
        } catch (error) {
            throw new customError(400, `WorkspaceRepository has error: ${error}`);
        }
    }

    public async removeUserFromWorkspace(workspaceId: number, userId: number): Promise<void> {
        try {
            await this.workspaceRepository.createQueryBuilder()
                .relation(Workspace, "users")
                .of(workspaceId)
                .remove(userId);
        } catch (error) {
            throw new customError(400, `WorkspaceRepository has error: ${error}`);
        }
    }

    public async getWorkspaceUsers(workspaceId: number): Promise<string[]> {
        try {
            const workspace = await this.workspaceRepository.findOne({
                where: {
                    id: workspaceId,
                },
                relations: ["users"],
            });
            return workspace?.users.map(user => user.username) || [];
        } catch (error) {
            throw new customError(400, `WorkspaceRepository has error: ${error}`);
        }
    }

    public async getWorkspaceByUserId(userId: number): Promise<Workspace[]> {
        try {
            const workspaces = await this.workspaceRepository.createQueryBuilder("workspace")
                .innerJoin("workspace.users", "user", "user.id = :userId", { userId })
                .getMany();
            return workspaces;
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
            return workspace?.boards || [];
        } catch (error) {
            throw new customError(400, `WorkspaceRepository has error: ${error}`);
        }
    }
}

export default new WorkspaceRepository();