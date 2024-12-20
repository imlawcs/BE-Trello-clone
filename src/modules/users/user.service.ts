import customError from '../../common/error/customError';
import { IUserToGet , IUserToUpdate } from '../../common/types/user.interface';
import roleService from '../roles/role.service';
import { Result } from '../../common/response/Result';
import UserRepository from './user.repository';
import RoleRepository from '../roles/role.repository';
import { User } from '../../database/entities/user';
import { boolean } from 'joi';

class UserService {
    async getAllUsers(): Promise<Result> {
        try {
            const users : any[] = await UserRepository.findAllUser();
            if (users.length === 0) {
                throw new customError(404, 'No users found');
            }
            return new Result(true, 200, 'Get users successful', { users: users });
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id: number): Promise<Result> {
        try {
            const user : User | null = await UserRepository.findByUserId(id);
            if (user === null) {
                throw new customError(404, 'User not found');
            }
            return new Result(true, 200, 'Get user successful', { user: user });
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
            const userExist = await UserRepository.findByUserId(id);
            if (userExist === null) {
                throw new customError(404, 'User not found');
            }
            if (user.username) {
                const usernameExist = await UserRepository.findByUsername(user.username);
                if (usernameExist) {
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
            const userExist = await UserRepository.findByUserId(id);
            if (userExist === null) {
                throw new customError(404, 'User not found');
            }

            const userRoles = await UserRepository.getRolesByUserId(id); 

            for (const roleName of userRoles) {
                const role = await RoleRepository.findRoleByName(roleName);
                if (role) {
                    await UserRepository.removeRoleFromUser(userExist, role); 
                }
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
                throw new customError(400, 'User ID or Role ID not provided.');
            }
    
            const user = await UserRepository.findByUserId(userId);
            if (!user) {
                throw new customError(404, 'User not found.');
            }
    
            const role = await roleService.getRoleById(roleId);
            if (!role) {
                throw new customError(404, 'Role not found.');
            }
    
            const userRoleExists : boolean = await UserRepository.findUserRole(userId, roleId);
            if (userRoleExists) {
                throw new customError(409, 'User already has this role.');
            }
    
            await UserRepository.assignRoleToUser(user, role);
            return new Result(true, 200, 'Role assigned to user successfully.');
            
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

            const userRoleExist : boolean = await UserRepository.findUserRole(userId, roleId);
            if (!userRoleExist) {
                throw new customError(404, 'User does not have this role');
            }

            const roleOfUser = await UserRepository.getRolesByUserId(userId);
            if (roleOfUser.length === 1) {
                throw new customError(400, 'User must have at least one role');
            }
            
            await UserRepository.removeRoleFromUser(userExist, roleExist);
            return new Result(true, 200, 'Remove role from user successful');
            
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
            const userExist = await UserRepository.findByUserId(userId);
            if (userExist === null) {
                throw new customError(404, 'User not found');
            }
            const roles : string[] = await UserRepository.getRolesByUserId(userId);
            if (roles.length === 0) {
                throw new customError(404, 'No roles found');
            }
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
            if (permissions.length === 0) {
                throw new customError(404, 'No permissions found');
            }
            return permissions;
        } catch (error) {
            throw error;
        }
    }

    async getWorkspacesOfUser(userId: number): Promise<any> {
        try {
            if (!userId) {
                throw new customError(400, 'No user id provided');
            }
            const workspaces : any = await UserRepository.getWorkspaceByUserId(userId);
            if (workspaces.length === 0) {
                throw new customError(404, 'No workspaces found');
            }
            return workspaces;
        } catch (error) {
            throw error;
        }
    }

    async getPermissionsOfUserInWorkspace(userId: number, workspaceId: number): Promise<string[]> {
        try {
            if (!userId || !workspaceId) {
                throw new customError(400, 'No user id or workspace id provided');
            }
            const permissions : string[] = await UserRepository.getPermissionsOfUserInWorkspace(userId, workspaceId);
            if (permissions.length === 0) {
                throw new customError(404, 'No permissions found');
            }
            return permissions;
        } catch (error) {
            throw error;
        }
    }

    async getPermissionsOfUserInBoard(userId: number, boardId: number): Promise<string[]> {
        try {
            if (!userId || !boardId) {
                throw new customError(400, 'No user id or board id provided');
            }
            const permissions : string[] = await UserRepository.getPermissionsOfUserInBoard(userId, boardId);
            if (permissions.length === 0) {
                throw new customError(404, 'No permissions found');
            }
            return permissions;
        } catch (error) {
            throw error;
        }
    }
}

const userService = new UserService();

export default userService;
