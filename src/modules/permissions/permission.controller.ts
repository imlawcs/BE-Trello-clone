import service from "./permission.service";
import { Request, Response, NextFunction } from "express";
import { Permission } from "../../database/entities/permission";

class PermissionController {
    async createPermission(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body;
            const result = await service.createPermission(name);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getPermissions(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (id) {
                const result = await service.findPermissionById(id);
                res.status(200).json(result);
            } else {
                const result = await service.findAllPermission();
                res.status(200).json(result);
            }
        }
        catch (error) {
            next(error);
        }
    }

    async updatePermission(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const permission: Permission = req.body;
            const result = await service.updatePermission(id, permission);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deletePermission(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await service.deletePermission(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new PermissionController();