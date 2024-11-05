import { dbSource } from "../../config/ormconfig";
import { User } from "../../database/entities/user";
import { Role } from "../../database/entities/role";
import customError from "../../common/error/customError";
import { Workspace } from "../../database/entities/workspace";

class UserRepository {
    private readonly userRepository = dbSource.getRepository(User); 

    public async findAllUser(): Promise<any[]> {
        try {
            const users = await this.userRepository.find({
                select: ["id", "email", "username", "fullname"],
                relations: ["roles"], 
            });

            console.log('Users retrieved:', users);
            
            return users.map(user => ({
                id: user.id,
                email: user.email,
                username: user.username,
                fullname: user.fullname,
                roles: user.roles.map(role => role.name), 
            }));
        } catch (error) {
            throw new customError(400, `UserRepository has error: ${error}`);
        }
    }    

    public async findByUsername(username: string): Promise<User | null> {
        try {
            const user = await this.userRepository.findOne({
                select: ["id", "email", "username", "fullname", "password"],
                where: {
                    username,
                },
                relations: ["roles"],
            });
            user?.roles.map(role => role.name);
            return user;
        }
        catch (error) {
            throw new customError(400, `UserRepository has error: ${error}`);
        }
    }

    public async findByUserId(id: number): Promise<User | null> {
        try {
            const user = await this.userRepository.findOne({
                select: ["id", "email", "username", "fullname"],
                where: {
                    id,
                },
                relations: ["roles"],
            });
            user?.roles.map(role => role.name);
            return user;
        }
        catch (error) {
            throw new customError(400, `UserRepository has error: ${error}`);
        }
    }

    public async create(user: User): Promise<User> {
        try {
            return await this.userRepository.save(user);
        }
        catch (error) {
            throw new customError(400, `UserRepository has error: ${error}`);
        }
    }

    public async update( userId: number, userData: Partial<User> ): Promise<void> {
        try {
            await this.userRepository.update(userId, userData);
        }
        catch (error) {
            throw new customError(400, `UserRepository has error: ${error}`);
        }
    }

    public async delete(id: number): Promise<void> {
        try {
            await this.userRepository.delete(id);
        }
        catch (error) {
            throw new customError(400, `UserRepository has error: ${error}`);
        }
    }

    public async getRolesByUserId(userId: number): Promise<string[]> {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
                relations: ["roles"],
            });
            return user?.roles.map(role => role.name) || [];
        }
        catch (error) {
            throw new customError(400, `UserRepository has error: ${error}`);
        }
    }

    public async getPermissionsByUserId(userId: number): Promise<string[]> {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
                relations: ["roles", "roles.permissions"],
            });
            return user?.roles.map(role => role.permissions.map(permission => permission.name)).flat() || [];
        }
        catch (error) {
            throw new customError(400, `UserRepository has error: ${error}`);
        }
    }

    public async getWorkspaceByUserId(userId: number): Promise<Workspace[]> {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
                relations: ["workspaces"],
            });
            if (!user?.workspaces) {
                throw new customError(404, `User with ID ${userId} has no workspaces.`);
            }
            return user?.workspaces;
        }
        catch (error) {
            throw new customError(400, `UserRepository has error: ${error}`);
        }
    }

    public async findUserRole(userId: number, roleId: number): Promise<boolean> {
        try {
            const user = await this.userRepository.findOne({
                select: ["id"],
                where: {
                    id: userId,
                },
                relations: ["roles"],
            });
    
            if (!user) {
                throw new customError(404, `User with ID ${userId} not found.`);
            }
    
            const hasRole = user.roles.some((role) => Number(role.id) === Number(roleId));
            return hasRole;
        } catch (error) {
            throw new customError(400, `UserRepository has error: ${error}`);
        }
    }
    

    public async assignRoleToUser(user : User, role : Role): Promise<void> {
        try {
            if(!user.roles) {
                const existingUser = await this.userRepository.findOne({
                    where: {
                        id: user.id,
                    },
                    relations: ["roles"],
                });

                user.roles = existingUser?.roles || [];
            }

            user.roles.push(role);
            await this.userRepository.save(user);
        }
        catch (error) {
            throw new customError(400, `UserRepository has error: ${error}`);
        }
    }

    public async removeRoleFromUser(user : User, role : Role): Promise<void> {
        try {
            if(!user.roles) {
                const existingUser = await this.userRepository.findOne({
                    where: {
                        id: user.id,
                    },
                    relations: ["roles"],
                });

                user.roles = existingUser?.roles || [];
            }
            user.roles = user.roles.filter(r => r.id !== role.id);
            await this.userRepository.save(user);
        }
        catch (error) {
            throw new customError(400, `UserRepository has error: ${error}`);
        }
    }
}

export default new UserRepository();