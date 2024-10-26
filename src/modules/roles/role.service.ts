import db from '../../config/connection';
import customError from '../../common/error/customError';
import Role from '../../common/types/role.interface';

class RoleService {
    async getAllRoles(): Promise<Role[]> {
        try {
            const roles: any = await db.query('SELECT * FROM roles');
            if (roles[0].length === 0) {
                throw new customError(404, 'No roles found');
            }
            return roles[0];
        } catch (error) {
            throw error;
        }
    }

    async getRoleById(id: string): Promise<Role[]> {
        try {
            const role: any = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
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

    async updateRole(id: string, role: Role): Promise<{ status: number; message: string }> {
        try {
            if (!id) {
                throw new customError(400, 'No id provided');
            }
            const roleExist: any = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
            if (roleExist[0].length === 0) {
                throw new customError(404, 'Role not found');
            }
            const rolenameExist: any = await db.query('SELECT * FROM roles WHERE rolename = ?', [role.rolename]);
            if (rolenameExist[0].length > 0) {
                throw new customError(409, 'Rolename already exists');
            }
            if (!role.rolename) {
                throw new customError(400, 'No empty fields');
            }
            await db.query('UPDATE roles SET ? WHERE id = ?', [role, id]);
            return {
                status: 200,
                message: 'Updated',
            };
        } catch (error) {
            throw error;
        }
    }

    async deleteRole(id: string): Promise<{ status: number; message: string }> {
        try {
            if (!id) {
                throw new customError(400, 'No id provided');
            }
            const roleExist: any = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
            if (roleExist[0].length === 0) {
                throw new customError(404, 'Role not found');
            }
            await db.query('DELETE FROM roles WHERE id = ?', [id]);
            return {
                status: 200,
                message: 'Deleted',
            };
        } catch (error) {
            throw error;
        }
    }

    async getPermissionsByRoleId(roleId: number): Promise<string[]> {
        try {
            if (!roleId) {
                throw new customError(400, 'No role id provided');
            }
            const permissions : any = await db.query('SELECT permissions.name FROM permissions JOIN role_permission ON permissions.id = role_permission.permission_id WHERE role_permission.roleId = ?', [roleId]);
            return permissions[0].map((permission: any) => permission.name);
        } catch (error) {
            throw error;
        }
    }


    async assignPermission(roleId: number, permissionId: number): Promise<{ status: number; message: string }> {
        try {
            const roleExist : any = await db.query('SELECT * FROM roles WHERE id = ?', [roleId]);
            if (roleExist.length === 0) {
                throw new customError(404, 'Role not found');
            }

            const permissionExist : any = await db.query('SELECT * FROM permissions WHERE id = ?', [permissionId]);
            if (permissionExist.length === 0) {
                throw new customError(404, 'Permission not found');
            }

            const rolePermissionExist : any = await db.query('SELECT * FROM role_permission WHERE role_id = ? AND permission_id = ?', [roleId, permissionId]);
            if (rolePermissionExist[0].length !== 0) {
                throw new customError(409, 'Permission already assigned to role');
            }

            await db.query('INSERT INTO role_permission (role_id, permission_id) VALUES (?, ?)', [roleId, permissionId]);
            return {
                status: 200,
                message: 'Permission assigned successfully'
            };
        } catch (error) {
            throw error;
        }
    }

    async deletePermissionOfRole(roleId: number, permissionId: number): Promise<{ status: number; message: string }> {
        try {
            const roleExist : any = await db.query('SELECT * FROM roles WHERE id = ?', [roleId]);
            if (roleExist.length === 0) {
                throw new customError(404, 'Role not found');
            }

            const permissionExist : any = await db.query('SELECT * FROM permissions WHERE id = ?', [permissionId]);
            if (permissionExist.length === 0) {
                throw new customError(404, 'Permission not found');
            }

            const rolePermissionExist : any = await db.query('SELECT * FROM role_permission WHERE role_id = ? AND permission_id = ?', [roleId, permissionId]);
            if (rolePermissionExist[0].length === 0) {
                throw new customError(404, 'Permission not assigned to role');
            }

            await db.query('DELETE FROM role_permission WHERE role_id = ? AND permission_id = ?', [roleId, permissionId]);
            return {
                status: 200,
                message: 'Permission deleted successfully'
            };
        } catch (error) {
            throw error;
        }
    }

    async createRole(name: string): Promise<{ status: number; message: string }> {
        try {
            if (!name) {
                throw new customError(400, 'Role name not provided');
            }
            const roleExist : any = await db.query('SELECT * FROM role WHERE name = ?', [name]);
            if (roleExist.length !== 0) {
                throw new customError(409, 'Role already exists');
            }
            await db.query('INSERT INTO role (name) VALUES (?)', [name]);
            return {
                status: 201,
                message: 'Role created successfully'
            };
        } catch (error) {
            throw error;
        }
    }
}

const roleService = new RoleService();

export default roleService;
