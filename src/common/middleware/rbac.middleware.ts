import { Request, Response, NextFunction } from 'express';
import service from '../../modules/users/user.service';

class RbacMiddleware{
    checkPermission(permission: string){
        return async (req: Request, res: Response, next: NextFunction) => {
            const userId = Number(req.user.id);
            
            const userPermissions = await service.getPermissionsOfUser(userId);
            if(userPermissions.includes(permission)){
                return next();
            }
            res.status(403).json({
                status: 403,
                message: 'Access denied',
            });
        }
    }
}

export default new RbacMiddleware();