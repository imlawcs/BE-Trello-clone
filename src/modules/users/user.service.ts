import db from '../../config/connection'; 
import bcrypt from 'bcrypt'; 
import customError from '../../common/error/customError';
import { IUserToGet , IUserToUpdate } from '../../common/types/user.interface';
import roleService from '../roles/role.service';

class UserService {
    async getAllUsers(): Promise<IUserToGet[]> {
        try {
            const [users]: any = await db.query('SELECT u.id, u.username, u.email, u.fullName, (SELECT r.name FROM roles r WHERE r.id = u.roleId) AS role FROM users u');
            if (users.length === 0) {
                throw new customError(404, 'No users found');
            }
            return users;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id: string): Promise<IUserToGet> {
        try {
            const [rows] : any = await db.query('SELECT id, username, email, fullName FROM users WHERE id = ?', [id]);
            if (rows.length === 0) {
                throw new customError(404, 'User not found');
            }
            const user: IUserToGet = {
                id: rows[0].id,
                username: rows[0].username,
                email: rows[0].email,
                fullName: rows[0].fullName
            };
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUserByRoleName(rolename: string): Promise<IUserToGet[]> {
        try {
            if (!rolename) {
                throw new customError(400, 'No rolename provided');
            }
            if (rolename !== 'admin' && rolename !== 'user') {
                throw new customError(400, 'Invalid rolename');
            }
            const [rows]: any = await db.query('SELECT users.id, username, email, fullName, roleId FROM users JOIN user_role ON users.id = user_role.user_id JOIN roles ON roles.id = user_role.role_id WHERE roles.name = ?', [rolename]);
            if (rows.length === 0) {
                throw new customError(404, 'No users found');
            }
            const users: IUserToGet[] = rows.map((row: any) => {
                return {
                    id: row.id,
                    username: row.username,
                    email: row.email,
                    fullName: row.fullName,
                    role: row.roleId == 1 ? 'admin' : 'user'
                };
            });
            return users;
        } catch (error) {
            throw error;
        }
    }

    // async createUser(user: User): Promise<{ status: number; message: string }> {
    //     try {
    //         if (!user.username || !user.email || !user.password || !user.fullName) {
    //             throw new customError(400, 'No empty fields');
    //         }
    //         const [userExist]: any = await db.query('SELECT * FROM users WHERE username = ?', [user.username]);
    //         if (userExist.length > 0) {
    //             throw new customError(409, 'Username already exists');
    //         }

    //         // Hash the password
    //         const saltRounds = 10;
    //         const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    //         user.password = hashedPassword;

    //         await db.query('INSERT INTO users SET ?', [user]);
    //         return {
    //             status: 201,
    //             message: 'Created'
    //         };
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async updateUser(id: string, user: IUserToUpdate): Promise<{ status: number; message: string }> {
        try {
            if (!id) {
                throw new customError(400, 'No id provided');
            }
            const [userExist]: any = await db.query('SELECT * FROM users WHERE id = ?', [id]);
            if (userExist.length === 0) {
                throw new customError(404, 'User not found');
            }
            const [usernameExist]: any = await db.query('SELECT * FROM users WHERE username = ?', [user.username]);
            if (usernameExist.length > 0) {
                throw new customError(409, 'Username already exists');
            }
            // if (!user.username || !user.email || !user.password || !user.fullName) {
            //     throw new customError(400, 'No empty fields');
            // }
            await db.query('UPDATE users SET ? WHERE id = ?', [user, id]);
            return {
                status: 200,
                message: 'Updated'
            };
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id: string): Promise<{ status: number; message: string }> {
        try {
            if (!id) {
                throw new customError(400, 'No id provided');
            }
            const [userExist]: any = await db.query('SELECT * FROM users WHERE id = ?', [id]);
            if (userExist.length === 0) {
                throw new customError(404, 'User not found');
            }
            await db.query('DELETE FROM users WHERE id = ?', [id]);
            return {
                status: 200,
                message: 'Deleted'
            };
        } catch (error) {
            throw error;
        }
    }

    async assignRole(userId: number, roleId: number): Promise<{ status: number; message: string }> {
        try {
            if (!userId || !roleId) {
                throw new customError(400, 'User id or role id not provided');
            }
            const userExist : any = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
            if (userExist.length === 0) {
                throw new customError(404, 'User not found');
            }

            const roleExist : any = await db.query('SELECT * FROM roles WHERE id = ?', [roleId]);
            if (roleExist.length === 0) {
                throw new customError(404, 'Role not found');
            }
            else{
                await db.query('INSERT INTO user_role (role_id, user_id) VALUES (?, ?)', [roleId, userId]);
                return {
                    status: 200,
                    message: 'Role assigned successfully'
                };
            }
        } catch (error) {
            throw error;
        }
    }

    async getPermissionsByUserId(userId: number): Promise<string[]> {
        try {
            const permissions : any = await db.query('SELECT permissions.name FROM permissions JOIN role_permission ON permissions.id = role_permission.permission_id JOIN roles ON role_permission.role_id = roles.id JOIN user_role ON roles.id = user_role.role_id JOIN users ON user_role.user_id = users.id WHERE users.id = ?', [userId]);
            return permissions[0].map((permission: any) => permission.name);
        } catch (error) {
            throw error;
        }
    }

    async getRolesOfUser(userId: number): Promise<string[]> {
        try {
            if (!userId) {
                throw new customError(400, 'No user id provided');
            }
            const roles : any = await db.query('SELECT roles.name FROM roles JOIN user_role ON roles.id = user_role.role_id JOIN users ON user_role.user_id = users.id WHERE users.id = ?', [userId]);
            return roles[0].map((role: any) => role.name);
        } catch (error) {
            throw error;
        }
    }

    async getPermissionsOfUser(userId: number): Promise<string[]> {
        try {
            if (!userId) {
                throw new customError(400, 'No user id provided');
            }
            const roles = await this.getRolesOfUser(userId);
            const permissions = await Promise.all(roles.map(async (role: string) => {
                const roleId : any = await db.query('SELECT id FROM roles WHERE name = ?', [role]);
                return roleService.getPermissionsByRoleId(roleId[0][0].id);
            }));
            return permissions.flat();
        } catch (error) {
            throw error;
        }
    }

}

const userService = new UserService();

export default userService;
