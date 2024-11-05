import workspaceRepository from "./workspace.repository";
import userRepository from "../users/user.repository";
import { Workspace } from "../../database/entities/workspace";
import { User } from "../../database/entities/user";
import customError from "../../common/error/customError";
import { Result } from "../../common/response/Result";
import e from "express";
import { Board } from "../../database/entities/board";

class WorkspaceService {
    private readonly workspaceRepository = workspaceRepository;

    public async findAllWorkspace(): Promise<Result> {
        try {
            const workspaces : Workspace [] = await this.workspaceRepository.findAllWorkspace();   
            if (workspaces.length === 0) {
                throw new customError(404, 'No workspaces found');
            }
            return new Result(true, 200, 'Get workspaces successful', { workspaces: workspaces });
        } catch (error) {
            throw error;
        }
    }    

    public async findByName(name: string): Promise<Workspace | null> {
        try {
            if (!name) {
                throw new customError(400, 'No workspace name provided');
            }
            const workspace = await this.workspaceRepository.findByName(name);
            if (!workspace) {
                throw new customError(404, 'Workspace not found');
            }
            workspace?.users.map(user => user.username);
            return workspace;
        }
        catch (error) {
            throw new customError(400, `WorkspaceService has error: ${error}`);
        }
    }

    public async findByWorkspaceId(id: number): Promise<Workspace | null> {
        try {
            if (!id) {
                throw new customError(400, 'No workspace id provided');
            }
            const workspace = await this.workspaceRepository.findByWorkspaceId(id);
            if (!workspace) {
                throw new customError(404, 'Workspace not found');
            }
            workspace?.users.map(user => user.username);
            return workspace;
        }
        catch (error) {
            throw new customError(400, `WorkspaceService has error: ${error}`);
        }
    }

    public async addUserToWorkspace(workspaceId: number, userId: number): Promise<Result> {
        try {
            if (!workspaceId) {
                throw new customError(400, 'No workspace id provided');
            }
            if (!userId) {
                throw new customError(400, 'No user id provided');
            }
            const WorkspaceExist = await this.workspaceRepository.findByWorkspaceId(workspaceId);
            if (!WorkspaceExist) {
                throw new customError(404, 'Workspace not found');
            }
            const UserExist = await userRepository.findByUserId(userId);
            if (!UserExist) {
                throw new customError(404, 'User not found');
            }
            const isUserInWorkspace = await this.workspaceRepository.findUserOfWorkspace(workspaceId, userId);
            if (isUserInWorkspace) {
                throw new customError(409, 'User already in workspace');
            }

            await this.workspaceRepository.addUserToWorkspace(WorkspaceExist, UserExist);
            return new Result(true, 200, 'Add user to workspace successful');
        }
        catch (error) {
            throw new customError(400, `WorkspaceService has error: ${error}`);
        }
    }

    public async removeUserFromWorkspace(workspaceId: number, userId: number): Promise<Result> {
        try {
            if (!workspaceId) {
                throw new customError(400, 'No workspace id provided');
            }
            const workspace = await this.workspaceRepository.findByWorkspaceId(workspaceId);
            if (!workspace) {
                throw new customError(404, 'Workspace not found');
            }

            const WorkspaceExist = await this.workspaceRepository.findByWorkspaceId(workspaceId);
            if (!WorkspaceExist) {
                throw new customError(404, 'Workspace not found');
            }
            const UserExist = await userRepository.findByUserId(userId);
            if (!UserExist) {
                throw new customError(404, 'User not found');
            }
            const isUserInWorkspace = await this.workspaceRepository.findUserOfWorkspace(workspaceId, userId);
            if (!isUserInWorkspace) {
                throw new customError(409, 'User not in workspace');
            }

            await this.workspaceRepository.removeUserFromWorkspace(WorkspaceExist, UserExist);
            return new Result(true, 200, 'Remove user from workspace successful');
        }
        catch (error) {
            throw new customError(400, `WorkspaceService has error: ${error}`);
        }
    }

    public async createWorkspace(workspace: Workspace): Promise<Result> {
        try {
            const newWorkspace = await this.workspaceRepository.createWorkspace(workspace);
            if (!newWorkspace) {
                throw new customError(400, 'Create workspace failed');
            }
            return new Result(true, 200, 'Create workspace successful', { workspace: newWorkspace });
        } catch (error) {
            throw error;
        }
    }

    public async updateWorkspace(workspace: Partial<Workspace>): Promise<Result> {
        try {
            const updatedWorkspace = await this.workspaceRepository.updateWorkspace(workspace);
            if (!updatedWorkspace) {
                throw new customError(400, 'Update workspace failed');
            }
            return new Result(true, 200, 'Update workspace successful', { workspace: updatedWorkspace });
        } catch (error) {
            throw error;
        }
    }

    public async deleteWorkspace(id: number): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, 'No workspace id provided');
            }

            const WorkspaceExist = await this.workspaceRepository.findByWorkspaceId(id);
            if (!WorkspaceExist) {
                throw new customError(404, 'Workspace not found');
            }
            await this.workspaceRepository.deleteWorkspace(id);
            return new Result(true, 200, 'Delete workspace successful');
        } catch (error) {
            throw error;
        }
    }

    public async getWorkspaceUsers(workspaceId: number): Promise<User[]> {
        try {
            if (!workspaceId) {
                throw new customError(400, 'No workspace id provided');
            }
            const users : User[] = await this.workspaceRepository.getWorkspaceUsers(workspaceId);
            if (users.length === 0) {
                throw new customError(404, 'No users found');
            }
            return users;
        } catch (error) {
            throw error;
        }
    }

    public async getWorkspaceBoards(workspaceId: number): Promise<Board[]> {
        try {
            if (!workspaceId) {
                throw new customError(400, 'No workspace id provided');
            }
            const boards : Board[] = await this.workspaceRepository.getWorkspaceBoards(workspaceId);
            if (boards.length === 0) {
                throw new customError(404, 'No boards found');
            }
            return boards;
        } catch (error) {
            throw error;
        }
    }
}

export default new WorkspaceService();