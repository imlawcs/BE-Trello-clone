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
    
    public async create(name: string): Promise<Role> {
        try {
            return await this.roleRepository.save({ name: name });
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

    public async update(role: Role): Promise<void> {
        try {
            await this.roleRepository.update(role.id, role);
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
                relations: ["permission"],
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
                relations: ["permission"],
                where: {
                    id: roleId
                }
            });
            const isExistPermission = role?.permissions.some((p) => p.id === permissionId);
            return isExistPermission ? true : false;
        }
        catch (error) {
            throw new customError(400, `RoleReposity has error : ${error}`);
        }
    }

    public async deletePermissionFromRole(role: Role, permissionId: number): Promise<void> {
        try {
            role.permissions = role.permissions.filter((p) => p.id !== permissionId);
            await this.roleRepository.save(role);
        }
        catch (error) {
            throw new customError(400, `RoleReposity has error : ${error}`);
        }
    }

    public async assignPermissionToRole(role: Role, permission : Permission): Promise<void> {
        try {
            role.permissions.push(permission);
            await this.roleRepository.save(role);
        }
        catch (error) {
            throw new customError(400, `RoleReposity has error : ${error}`);
        }
    }
}

export default new RoleRepository();