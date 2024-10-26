import { Request, Response, NextFunction } from 'express';
import service from '../../modules/users/user.service';

class RbacMiddleware{
    checkPermission(permission: string){
        return async (req: Request, res: Response, next: NextFunction) => {
            const userId = Number(req.user.id);
            console.log(userId);
            
            const userPermissions = await service.getPermissionsByUserId(userId);
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