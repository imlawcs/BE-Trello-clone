import service from "./permission.service";
import { Request, Response, NextFunction } from "express";

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
}

export default new PermissionController();