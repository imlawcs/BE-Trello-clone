import workspaceService from "./workspace.service";
import e, { Request, Response, NextFunction } from "express";
import { Workspace } from "../../database/entities/workspace";
import { Result } from "../../common/response/Result";

class WorkspaceController {
    public async findAllWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result: Result = await workspaceService.findAllWorkspace();
            res.status(result.status).send(result);
        } catch (error) {
            next(error);
        }
    }

    public async findByName(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const name = req.params.name;
            const workspace: Workspace | null = await workspaceService.findByName(name);
            res.status(200).send(workspace);
        } catch (error) {
            next(error);
        }
    }

    public async findByWorkspaceId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const workspace: Workspace | null = await workspaceService.findByWorkspaceId(id);
            res.status(200).send(workspace);
        } catch (error) {
            next(error);
        }
    }

    public async addUserToWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workspaceId = Number(req.body.workspaceId);
            const userId = Number(req.body.userId);
            const result : Result = await workspaceService.addUserToWorkspace(workspaceId, userId);
            res.status(200).send(result);
        } catch (error) {
            next(error);
        }
    }

    public async removeUserFromWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workspaceId = Number(req.body.workspaceId);
            const userId = Number(req.body.userId);
            const result: Result = await workspaceService.removeUserFromWorkspace(workspaceId, userId);
            res.status(200).send(result);
        } catch (error) {
            next(error);
        }
    }

    public async assignRoleInWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workspaceId = Number(req.body.workspaceId);
            const userId = Number(req.body.userId);
            const roleId = Number(req.body.roleId);
            const result: Result = await workspaceService.assignRoleInWorkspace(workspaceId, userId, roleId);
            res.status(200).send(result);
        } catch (error) {
            next(error);
        }
    }

    public async createWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workspace: Workspace = req.body;
            const userId = parseInt(req.user.id);
            const result: Result = await workspaceService.createWorkspace(workspace, userId);
            res.status(result.status).send(result);
        } catch (error) { 
            next(error);
        }
    }

    public async updateWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const workspace: Partial<Workspace> = req.body;
            const result: Result = await workspaceService.updateWorkspace(id, workspace);
            res.status(result.status).send(result);
        } catch (error) {
            next(error);
        }
    }

    public async deleteWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const result: Result = await workspaceService.deleteWorkspace(id);
            res.status(result.status).send(result);
        } catch (error) {
            next(error);
        }
    }

    public async getWorkspaceUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const users = await workspaceService.getWorkspaceUsers(id);
            res.status(200).send(users);
        } catch (error) {
            next(error);
        }
    }
}

export default new WorkspaceController();