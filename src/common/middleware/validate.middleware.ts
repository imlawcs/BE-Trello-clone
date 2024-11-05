import {StatusCodes} from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../error/customError';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import RoleSchema from '../schemas/role.schema';
import { permissionSchema } from '../schemas/permission.schema';
import Userschema from '../schemas/user.schema';
import WorkspaceSchema from '../schemas/workspace.schema';


class ValidateMiddleware {
    async validateRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await registerSchema.validateAsync(req.body, { abortEarly: false });

            next();
        } catch (error : any) {
            next(new CustomError(StatusCodes.BAD_REQUEST, error.message));
        }
    }

    async validateLogin(req: Request, res: Response, next: NextFunction) {
        try {
            await loginSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error : any) {
            next(new CustomError(StatusCodes.BAD_REQUEST, error.message));
        }
    }

    async validateUpdateUser(req: Request, res: Response, next: NextFunction) {
        try {
            await Userschema.userUpdateSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error : any) {
            next(new CustomError(StatusCodes.BAD_REQUEST, error.message));
        }
    }

    async validateAssignRole(req: Request, res: Response, next: NextFunction) {
        try {
            await Userschema.assignRoleSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error : any) {
            next(new CustomError(StatusCodes.BAD_REQUEST, error.message));
        }
    }

    async validateRemoveRole(req: Request, res: Response, next: NextFunction) {
        try {
            await Userschema.removeRoleSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error : any) {
            next(new CustomError(StatusCodes.BAD_REQUEST, error.message));
        }
    }

    async validateCreateRole(req: Request, res: Response, next: NextFunction) {
        try {
            await RoleSchema.roleSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error : any) {
            next(new CustomError(StatusCodes.BAD_REQUEST, error.message));
        }
    }

    async validateUpdateRole(req: Request, res: Response, next: NextFunction) {
        try {
            await RoleSchema.roleSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error : any) {
            next(new CustomError(StatusCodes.BAD_REQUEST, error.message));
        }
    }

    async validateAssignPermission(req: Request, res: Response, next: NextFunction) {
        try {
            await RoleSchema.assignPermissionSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error : any) {
            next(new CustomError(StatusCodes.BAD_REQUEST, error.message));
        }
    }

    async validateRemovePermission(req: Request, res: Response, next: NextFunction) {
        try {
            await RoleSchema.removePermissionSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error : any) {
            next(new CustomError(StatusCodes.BAD_REQUEST, error.message));
        }
    }

    async validateCreatePermission(req: Request, res: Response, next: NextFunction) {
        try {
            await permissionSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error : any) {
            next(new CustomError(StatusCodes.BAD_REQUEST, error.message));
        }
    }

    async validateUpdatePermission(req: Request, res: Response, next: NextFunction) {
        try {
            await permissionSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error : any) {
            next(new CustomError(StatusCodes.BAD_REQUEST, error.message));
        }
    }

    async validateCreateWorkspace(req: Request, res: Response, next: NextFunction) {
        try {
            await WorkspaceSchema.workspaceCreateSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error : any) {
            next(new CustomError(StatusCodes.BAD_REQUEST, error.message));
        }
    }

    async validateUpdateWorkspace(req: Request, res: Response, next: NextFunction) {
        try {
            await WorkspaceSchema.workspaceUpdateSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error : any) {
            next(new CustomError(StatusCodes.BAD_REQUEST, error.message));
        }
    }

    async validateAddUserToWorkspace(req: Request, res: Response, next: NextFunction) {
        try {
            await WorkspaceSchema.addUserToWorkspaceSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error : any) {
            next(new CustomError(StatusCodes.BAD_REQUEST, error.message));
        }
    }

    async validateRemoveUserFromWorkspace(req: Request, res: Response, next: NextFunction) {
        try {
            await WorkspaceSchema.removeUserFromWorkspaceSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error : any) {
            next(new CustomError(StatusCodes.BAD_REQUEST, error.message));
        }
    }
}

export default new ValidateMiddleware()