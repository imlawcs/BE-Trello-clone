import { dbSource } from "../../config/ormconfig";
import { Role } from "../../database/entities/role";
import { Permission } from "../../database/entities/permission";
import customError from "../../common/error/customError";

class RoleRepository {
    private readonly roleRepository = dbSource.getRepository(Role);

    public async findAllRole(): Promise<Role[]> {
        try {
            return await this.roleRepository.find();
        }
        catch (error) {
            throw new customError(400, `RoleReposity has error : ${error}`);
        }
    }
    
    public async create(role : Role): Promise<Role> {
        try {
            return await this.roleRepository.save(role);
        }
        catch (error) {
            throw new customError(400, `RoleReposity has error : ${error}`);
        }
    }

    public async findRoleById(id: number): Promise<Role | null> {
        try {
            return await this.roleRepository.findOne({
                select: ["id", "name"],
                where: {
                    id: id
                }
            });
        }
        catch (error) {
            throw new customError(400, `RoleReposity has error : ${error}`);
        }
    }

    public async findRoleByName(name: string): Promise<Role | null> {
        try {
            return await this.roleRepository.findOne({
                select: ["id", "name"],
                where: {
                    name: name
                }
            });
        }
        catch (error) {
            throw new customError(400, `RoleReposity has error : ${error}`);
        }
    }

    public async update(roleId: number, role: Partial<Role>): Promise<void> {
        try {
            await this.roleRepository.update(roleId, role);
        }
        catch (error) {
            throw new customError(400, `RoleReposity has error : ${error}`);
        }
    }

    public async delete(id: number): Promise<void> {
        try {
            await this.roleRepository.delete(id);
        }
        catch (error) {
            throw new customError(400, `RoleReposity has error : ${error}`);
        }
    }

    public async findPermissionsByRoleId(id: number): Promise<string[]> {
        try {
            const role = await this.roleRepository.findOne({
                select: ["id"],
                relations: ["permissions"],
                where: {
                    id: id
                }
            });
            return role?.permissions.map((p) => p.name) || [];
        }
        catch (error) {
            throw new customError(400, `RoleReposity has error : ${error}`);
        }
    }

    public async findRolePermission(roleId: number, permissionId: number): Promise<boolean> {
        try {
            const role = await this.roleRepository.findOne({
                select: ["id"],
                where: {
                    id: roleId,
                },
                relations: ["permissions"],
            });          
            
            if(!role) {
                throw new customError(404, `Role not found`);
            }

            const hasPermission = role?.permissions.some((p) => p.id === permissionId);
            return hasPermission;
        }
        catch (error) {
            throw new customError(400, `RoleReposity has error : ${error}`);
        }
    }

    public async deletePermissionFromRole(role: Role, permissionId: number): Promise<void> {
        try {
            if (!role.permissions) {
                const existingRole = await this.roleRepository.findOne({
                    where: { id: role.id },
                    relations: ["permissions"],
                });
    
                role.permissions = existingRole?.permissions || [];
            }
            role.permissions = role.permissions.filter((p) => p.id !== permissionId);
            await this.roleRepository.save(role);
        }
        catch (error) {
            throw new customError(400, `RoleReposity has error : ${error}`);
        }
    }

    public async assignPermissionToRole(role: Role, permission: Permission): Promise<void> {
        try {
            if (!role.permissions) {
                const existingRole = await this.roleRepository.findOne({
                    where: { id: role.id },
                    relations: ["permissions"],
                });
    
                role.permissions = existingRole?.permissions || [];
            }
    
            if (!role.permissions.some(p => p.id === permission.id)) {
                role.permissions.push(permission);
                await this.roleRepository.save(role);
            } 
        } catch (error) {
            throw new customError(400, `RoleRepository has error: ${error}`);
        }
    }
    
}

export default new RoleRepository();