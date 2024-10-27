import { dbSource } from "../../config/ormconfig";
import { Permission } from "../../database/entities/permission";

class PermissionRepository {
    private readonly permissionRepository = dbSource.getRepository(Permission);

    public async findAllPermission(): Promise<Permission[]> {
        try {
            return await this.permissionRepository.find();
        }
        catch (error) {
            throw error;
        }
    }

    public async findPermissionById(id: number): Promise<Permission | null> {
        try {
            return await this.permissionRepository.findOne({
                select: ["id", "name"],
                where: {
                    id: id
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
    
    public async findPermissionByName(name: string): Promise<Permission | null> {
        try {
            return await this.permissionRepository.findOne({
                select: ["id", "name"],
                where: {
                    name: name
                }
            });
        }
        catch (error) {
            throw error;
        }
    }

    public async create(name : string): Promise<void> {
        try {
            this.permissionRepository.save({ name: name });
        }
        catch (error) {
            throw error;
        }
    }

    public async update(permissionId: number, permission: Partial<Permission>): Promise<void> {
        try {
            await this.permissionRepository.update(permissionId, permission);
        }
        catch (error) {
            throw error;
        }
    }

    public async delete(id: number): Promise<void> {
        try {
            await this.permissionRepository.delete(id);
        }
        catch (error) {
            throw error;
        }
    }
}

export default new PermissionRepository();