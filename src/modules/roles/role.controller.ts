import { Request, Response, NextFunction } from 'express';
import service from './role.service';

class RoleController {
    public async getRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (id) {
                const role = await service.getRoleById(id);
                res.status(200).send(role);
            } else {
                const roles = await service.getAllRoles();
                res.status(200).send(roles);
            }
        } catch (error) {
            next(error);
        }
    }

    async createRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body;
            const result = await service.createRole(name);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const role = req.body;
            const updateStatus = await service.updateRole(id, role);
            res.status(200).send(updateStatus);
        } catch (error) {
            next(error);
        }
    }

    public async deleteRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const deleteStatus = await service.deleteRole(id);
            res.status(200).send(deleteStatus);
        } catch (error) {
            next(error);
        }
    }

    async getPermissionsByRoleId(req: Request, res: Response, next: NextFunction) {
        try {
            const roleId = Number(req.params.id);
            const result = await service.getPermissionsByRoleId(roleId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }


    async assignPermission(req: Request, res: Response, next: NextFunction) {
        try {
            const { roleId, permissionId } = req.body;
            const result = await service.assignPermission(roleId, permissionId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deletePermissionOfRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { roleId, permissionId } = req.body;
            const result = await service.deletePermissionOfRole(roleId, permissionId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

const roleController = new RoleController();

export default roleController;
