import customError from '../../common/error/customError';
import { IUserToGet , IUserToUpdate } from '../../common/types/user.interface';
import roleService from '../roles/role.service';
import { Result } from '../../common/response/Result';
import UserRepository from './user.repository';
import { User } from '../../database/entities/user';

class UserService {
    async getAllUsers(): Promise<Result> {
        try {
            const [users]: any = await UserRepository.findAllUser();
            if (users.length === 0) {
                throw new customError(404, 'No users found');
            }
            return new Result(true, 200, 'Get users successful', { users });
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id: number): Promise<Result> {
        try {
            const [rows] : any = await UserRepository.findByUserId(id);
            if (rows.length === 0) {
                throw new customError(404, 'User not found');
            }
            return new Result(true, 200, 'Get user successful', { user: rows[0] });
        } catch (error) {
            throw error;
        }
    }

    // async getUserByRoleName(rolename: string): Promise<Result> {
    //     try {
    //         if (!rolename) {
    //             throw new customError(400, 'No rolename provided');
    //         }
    //         if (rolename !== 'admin' && rolename !== 'user') {
    //             throw new customError(400, 'Invalid rolename');
    //         }
    //         const [rows]: any = await db.query('SELECT users.id, username, email, fullName, roleId FROM users JOIN user_role ON users.id = user_role.user_id JOIN roles ON roles.id = user_role.role_id WHERE roles.name = ?', [rolename]);
    //         if (rows.length === 0) {
    //             throw new customError(404, 'No users found');
    //         }
    //         const users: IUserToGet[] = rows.map((row: any) => {
    //             return {
    //                 id: row.id,
    //                 username: row.username,
    //                 email: row.email,
    //                 fullName: row.fullName,
    //                 role: row.roleId == 1 ? 'admin' : 'user'
    //             };
    //         });
    //         return users;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

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

    async updateUser(id: number, user: Partial<User>): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, 'No id provided');
            }
            const [userExist]: any = await UserRepository.findByUserId(id);
            if (userExist.length === 0) {
                throw new customError(404, 'User not found');
            }
            if (user.username) {
                const [usernameExist]: any = await UserRepository.findByUsername(user.username);
                if (usernameExist.length > 0) {
                    throw new customError(409, 'Username already exists');
                }
                if (usernameExist.length > 0) {
                    throw new customError(409, 'Username already exists');
                }
            }
            await UserRepository.update(id, user);
            return new Result(true, 200, 'Updated');
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id: number): Promise<Result> {
        try {
            if (!id) {
                throw new customError(400, 'No id provided');
            }
            const [userExist]: any = await UserRepository.findByUserId(id);
            if (userExist.length === 0) {
                throw new customError(404, 'User not found');
            }
            await UserRepository.delete(id);
            return new Result(true, 200, 'Deleted');
        } catch (error) {
            throw error;
        }
    }

    async assignRole(userId: number, roleId: number): Promise<Result> {
        try {
            if (!userId || !roleId) {
                throw new customError(400, 'User id or role id not provided');
            }
            const userExist : any = await UserRepository.findByUserId(userId);
            if (userExist.length === 0) {
                throw new customError(404, 'User not found');
            }

            const roleExist : any = await roleService.getRoleById(roleId);
            if (roleExist.length === 0) {
                throw new customError(404, 'Role not found');
            }
            else{
                await UserRepository.assignRoleToUser(userExist, roleExist);
                return new Result(true, 200, 'Assign role to user successful');
            }
        } catch (error) {
            throw error;
        }
    }

    async removeRole(userId: number, roleId: number): Promise<Result> {
        try {
            if (!userId || !roleId) {
                throw new customError(400, 'User id or role id not provided');
            }
            const userExist : any = await UserRepository.findByUserId(userId);
            if (userExist.length === 0) {
                throw new customError(404, 'User not found');
            }

            const roleExist : any = await roleService.getRoleById(roleId);
            if (roleExist.length === 0) {
                throw new customError(404, 'Role not found');
            }
            else{
                await UserRepository.removeRoleFromUser(userExist, roleExist);
                return new Result(true, 200, 'Remove role from user successful');
            }
        } catch (error) {
            throw error;
        }
    }

    // async getPermissionsByUserId(userId: number): Promise<string[]> {
    //     try {
    //         const permissions : string[] = await UserRepository.getPermissionsByUserId(userId);
    //         return permissions;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async getRolesOfUser(userId: number): Promise<string[]> {
        try {
            if (!userId) {
                throw new customError(400, 'No user id provided');
            }
            const roles : string[] = await UserRepository.getRolesByUserId(userId);
            return roles;
        } catch (error) {
            throw error;
        }
    }

    async getPermissionsOfUser(userId: number): Promise<string[]> {
        try {
            if (!userId) {
                throw new customError(400, 'No user id provided');
            }
            const permissions : string[] = await UserRepository.getPermissionsByUserId(userId);
            return permissions;
        } catch (error) {
            throw error;
        }
    }
}

const userService = new UserService();

export default userService;
