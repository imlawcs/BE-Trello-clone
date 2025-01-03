import { Request, Response, NextFunction } from 'express';
import boardRepository from '../../modules/boards/board.repository';
import commentRepository from '../../modules/comments/comment.repository';
import workspaceRepository from '../../modules/workspace/workspace.repository';
import userRepository from '../../modules/users/user.repository';
import customError from '../error/customError';

class RbacMiddleware {
    checkPermission(permission: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const userId = Number(req.user.id);

                const userPermissions = await userRepository.getPermissionsByUserId(userId);
                if (userPermissions.includes(permission)) {
                    return next();
                }

                throw new customError(403, 'Access denied');
            } catch (err) {
                next(err);
            }
        };
    }

    checkPermissionInBoard(permission: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const userId = Number(req.user.id);
                const boardId = Number(req.body.boardId) || Number(req.params.id);

                const userBoard = await boardRepository.isUserInBoard(userId, boardId);
                if (userBoard) {
                    const userPermissions = await userRepository.getPermissionsOfUserInBoard(userId, boardId);
                    console.log('userPermissions:', userPermissions);                    
                    if (userPermissions.includes(permission)) {
                        return next();
                    }
                    throw new customError(403, 'Access denied');
                }

                throw new customError(403, 'User is not in this board');
            } catch (err) {
                next(err);
            }
        };
    }

    checkPermissionInWorkspace(permission: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const userId = Number(req.user.id);
                const workspaceId = Number(req.body.workspaceId);
    
                const userExist = await userRepository.findByUserId(userId);
                if (!userExist) {
                    throw new customError(404, 'User not found');
                }
    
                const workspaceExist = await workspaceRepository.findByWorkspaceId(workspaceId);
                if (!workspaceExist) {
                    throw new customError(404, 'Workspace not found');
                }
    
                const isUserInWorkspace = await workspaceRepository.findUserOfWorkspace(workspaceId, userId);
                if (isUserInWorkspace) {
                    const userPermissions = await userRepository.getPermissionsOfUserInWorkspace(userId, workspaceId);
                    if (userPermissions.includes(permission)) {
                        return next();
                    }
                    throw new customError(403, 'Access denied');
                }
    
                throw new customError(403, 'User is not in this workspace');
            } catch (err) {
                console.error('Error in checkPermissionInWorkspace:', err);
                next(err);
            }
        };
    }
    

    async isUserInBoard(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.user.id);
            const boardId = Number(req.body.boardId);

            const userBoard = await boardRepository.isUserInBoard(userId, boardId);
            if (userBoard) {
                return next();
            }

            throw new customError(403, 'User is not in this board');
        } catch (err) {
            next(err);
        }
    }

    async isUserInWorkspace(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.user.id);
            const workspaceId = Number(req.body.workspaceId);

            const isUserInWorkspace = await workspaceRepository.findUserOfWorkspace(userId, workspaceId);
            if (isUserInWorkspace) {
                return next();
            }

            throw new customError(403, 'User is not in this workspace');
        } catch (err) {
            next(err);
        }
    }

    async isOwnerOfComment(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.user.id);
            const commentId = Number(req.params.id);

            const user = await commentRepository.getCommentOwner(commentId);
            if (user.id === userId) {
                return next();
            }

            throw new customError(403, 'Access denied');
        } catch (err) {
            next(err);
        }
    }
}

export default new RbacMiddleware();
