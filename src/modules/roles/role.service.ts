import RoleRepository from './role.repository';
import customError from '../../common/error/customError';
import { Role } from '../../database/entities/role';
import { Result } from '../../common/response/Result';
import permissionRepository from '../permissions/permission.repository';
import { BlobOptions } from 'buffer';
import { permission } from 'process';

class RoleService {
    async getAllRoles(): Promise<Role[]> {
        try {
            const roles: Role[] = await RoleRepository.findAllRole();
            if (roles.length === 0) {
                throw new customError(404, 'No roles found');
            }
            return roles;
        } catch (error) {
            throw error;
        }
    }

    async getRoleById(id: number): Promise<Role> {
        try {
            const role: Role | null = await RoleRepository.findRoleById(id);
            if (role === null) {
                throw new customError(404, 'Role not found');
            }
            return role;
        } catch (error) {
            throw error;
        }
    }

    // async createRole(role: Role): Promise<{ status: number; message: string }> {
    //     try {
    //         if (!role.rolename) {
    //             throw new customError(400, 'No empty fields');
    //         }
    //         const roleExist: any = await db.query('SELECT * FROM roles WHERE rolename = ?', [role.rolename]);
    //         if (roleExist[0].length > 0) {
    //             throw new customError(409, 'Rolename already exists');
    //         }
    //         await db.query('INSERT INTO roles SET ?', [role]);
    //         return {
    //             status: 201,
    //             message: 'Created',
    //         };
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async updateRole(id: number, role: Partial<Role>): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, 'No id provided');
            }

            const roleExist: Role | null = await RoleRepository.findRoleById(id);
            if (!roleExist) {
                throw new customError(404, 'Role not found');
            }

            if (role.name) {    
                const rolenameExist: Role | null = await RoleRepository.findRoleByName(role.name);
                if (rolenameExist) {
                    throw new customError(409, 'Rolename already exists');
                }
            }

            await RoleRepository.update(id, role);
            return new Result(true, 200, 'Updated');
        } catch (error) {
            throw error;
        }
    }

    async deleteRole(id: number): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, 'No id provided');
            }
            const roleExist = await RoleRepository.findRoleById(id);
            if (roleExist === null) {
                throw new customError(404, 'Role not found');
            }

            const rolePermissionExist = await RoleRepository.findPermissionsByRoleId(id);

            for (const permissionName of rolePermissionExist) {
                const permission = await permissionRepository.findPermissionByName(permissionName);
                if (permission) {
                    await RoleRepository.deletePermissionFromRole(roleExist, permission.id);
                }
            }

            await RoleRepository.delete(id);
            return new Result(true, 200, 'Deleted');
        } catch (error) {
            throw error;
        }
    }

    async getPermissionsByRoleId(roleId: number): Promise<string[]> {
        try {
            if (!roleId) {
                throw new customError(400, 'No role id provided');
            }
            const permissions = await RoleRepository.findPermissionsByRoleId(roleId);
            if (permissions.length === 0) {
                throw new customError(404, 'No permissions found');
            }
            return permissions;
        } catch (error) {
            throw error;
        }
    }


    async assignPermission(roleId: number, permissionId: number): Promise<Result> {
        try {
            const roleExist = await RoleRepository.findRoleById(roleId);
            if (!roleExist) {
                throw new customError(404, 'Role not found');
            }

            const permissionExist = await permissionRepository.findPermissionById(permissionId);
            if (!permissionExist) {
                throw new customError(404, 'Permission not found');
            }

            const rolePermissionExist : boolean = await RoleRepository.findRolePermission(roleId, permissionId);
            if (rolePermissionExist) {
                throw new customError(409, 'Permission already assigned to role');
            }

            await RoleRepository.assignPermissionToRole(roleExist, permissionExist);
            return new Result(true, 200, 'Permission assigned to role successfully');
        } 
        catch (error) {
            throw error;
        }
    }

    async deletePermissionOfRole(roleId: number, permissionId: number): Promise<Result> {
        try {
            const roleExist = await RoleRepository.findRoleById(roleId);
            if (roleExist === null) {
                throw new customError(404, 'Role not found');
            }

            const permissionExist = await permissionRepository.findPermissionById(permissionId);
            if (permissionExist === null) {
                throw new customError(404, 'Permission not found');
            }

            const rolePermissionExist = await RoleRepository.findRolePermission(roleId, permissionId);
            if (!rolePermissionExist) {
                throw new customError(404, 'Permission not assigned to role');
            }

            await RoleRepository.deletePermissionFromRole(roleExist, permissionId);
            return new Result(true, 200, 'Permission deleted from role successfully');
        } catch (error) {
            throw error;
        }
    }

    async createRole(name : string): Promise<Result> {
        try {
            if (!name) {
                throw new customError(400, 'Role name not provided');
            }
            const roleExist : Role | null = await RoleRepository.findRoleByName(name);
            if (roleExist) {
                throw new customError(409, 'Role already exists');
            }
            const role = {
                name: name,
                permissions: [],
                users: []
            }
            await RoleRepository.create(role);
            return new Result(true, 201, 'Role created successfully');
        } catch (error) {
            throw error;
        }
    }
}

const roleService = new RoleService();

export default roleService;
