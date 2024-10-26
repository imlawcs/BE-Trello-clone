import db from "../../config/connection";
import customError from "../../common/error/customError";

class PermissionService {
    
    async createPermission(name: string): Promise<{ status: number; message: string }> {
        try {
            if (!name) {
                throw new customError(400, 'Permission name not provided');
            }
            const permissionExist : any = await db.query('SELECT * FROM permissions WHERE name = ?', [name]);
            if (permissionExist.length !== 0) {
                throw new customError(409, 'Permission already exists');
            }
            await db.query('INSERT INTO permissions (name) VALUES (?)', [name]);
            return {
                status: 201,
                message: 'Permission created successfully'
            };
        } catch (error) {
            throw error;
        }
    }
}

export default new PermissionService();