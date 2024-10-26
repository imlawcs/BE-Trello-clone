import permissionRepository from "./permission.repository";
import customError from "../../common/error/customError";
import { Permission } from "../../database/entities/permission";
import { Result } from "../../common/response/Result";

class PermissionService {
    
    async createPermission(name: string): Promise<Result> {
        try {
            if (!name) {
                throw new customError(400, 'Permission name not provided');
            }
            const permissionExist : any = await permissionRepository.findPermissionByName(name);
            if (permissionExist.length !== 0) {
                throw new customError(409, 'Permission already exists');
            }
            await permissionRepository.create(name);
            return new Result(true, 201, 'Permission created successfully');
        } catch (error) {
            throw error;
        }
    }

    async findAllPermission(): Promise<Permission[]> {
        try {
            const permissions = await permissionRepository.findAllPermission();
            return permissions;
        } catch (error) {
            throw error;
        }
    }

    async findPermissionById(id: number): Promise<Permission> {
        try {
            const permission = await permissionRepository.findPermissionById(id);
            if (!permission) {
                throw new customError(404, 'Permission not found');
            }
            return permission;
        } catch (error) {
            throw error;
        }
    }

    async updatePermission(id: number, permission : Permission): Promise<Result> {
        try {
            if (!permission.name) {
                throw new customError(400, 'Permission name not provided');
            }
            const permissionExist = await permissionRepository.findPermissionById(id);
            if (!permissionExist) {
                throw new customError(404, 'Permission not found');
            }
            await permissionRepository.update(id, permission);
            return new Result(true, 200, 'Permission updated successfully');
        } catch (error) {
            throw error;
        }
    }

    async deletePermission(id: number): Promise<Result> {
        try {
            const permissionExist = await permissionRepository.findPermissionById(id);
            if (!permissionExist) {
                throw new customError(404, 'Permission not found');
            }
            await permissionRepository.delete(id);
            return new Result(true, 200, 'Permission deleted successfully');
        } catch (error) {
            throw error;
        }
    }
}

export default new PermissionService();