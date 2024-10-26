import RoleRepository from './role.repository';
import customError from '../../common/error/customError';
import { Role } from '../../database/entities/role';
import { Result } from '../../common/response/Result';
import permissionRepository from '../permissions/permission.repository';

class RoleService {
    async getAllRoles(): Promise<Role[]> {
        try {
            const roles: any = await RoleRepository.findAllRole();
            if (roles[0].length === 0) {
                throw new customError(404, 'No roles found');
            }
            return roles[0];
        } catch (error) {
            throw error;
        }
    }

    async getRoleById(id: number): Promise<Role[]> {
        try {
            const role: any = await RoleRepository.findRoleById(id);
            if (role[0].length === 0) {
                throw new customError(404, 'Role not found');
            }
            return role[0];
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

    async updateRole(id: number, role: Role): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, 'No id provided');
            }
            const roleExist: any = await RoleRepository.findRoleById(id);
            if (roleExist[0].length === 0) {
                throw new customError(404, 'Role not found');
            }
            const rolenameExist: any = await RoleRepository.findRoleByName(role.name);
            if (rolenameExist[0].length > 0) {
                throw new customError(409, 'Rolename already exists');
            }
            if (!role.name) {
                throw new customError(400, 'No empty fields');
            }
            await RoleRepository.update(role);
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
            const roleExist: any = await RoleRepository.findRoleById(id);
            if (roleExist[0].length === 0) {
                throw new customError(404, 'Role not found');
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
            const permissions : any = await RoleRepository.findPermissionsByRoleId(roleId);
            return permissions;
        } catch (error) {
            throw error;
        }
    }


    async assignPermission(roleId: number, permissionId: number): Promise<Result> {
        try {
            const roleExist : any = await RoleRepository.findRoleById(roleId);
            if (roleExist.length === 0) {
                throw new customError(404, 'Role not found');
            }

            const permissionExist : any = await permissionRepository.findPermissionById(permissionId);
            if (permissionExist.length === 0) {
                throw new customError(404, 'Permission not found');
            }

            const rolePermissionExist : any = await RoleRepository.findRolePermission(roleExist, permissionExist);
            if (rolePermissionExist[0].length !== 0) {
                throw new customError(409, 'Permission already assigned to role');
            }

            await RoleRepository.assignPermissionToRole(roleExist, permissionExist);
            return new Result(true, 200, 'Permission assigned to role successfully');
        } catch (error) {
            throw error;
        }
    }

    async deletePermissionOfRole(roleId: number, permissionId: number): Promise<Result> {
        try {
            const roleExist : any = await RoleRepository.findRoleById(roleId);
            if (roleExist.length === 0) {
                throw new customError(404, 'Role not found');
            }

            const permissionExist : any = await permissionRepository.findPermissionById(permissionId);
            if (permissionExist.length === 0) {
                throw new customError(404, 'Permission not found');
            }

            const rolePermissionExist : any = await RoleRepository.findRolePermission(roleExist, permissionExist);
            if (rolePermissionExist[0].length === 0) {
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
            const roleExist : any = await RoleRepository.findRoleByName(name);
            if (roleExist.length !== 0) {
                throw new customError(409, 'Role already exists');
            }
            await RoleRepository.create(name);
            return new Result(true, 201, 'Role created successfully');
        } catch (error) {
            throw error;
        }
    }
}

const roleService = new RoleService();

export default roleService;
