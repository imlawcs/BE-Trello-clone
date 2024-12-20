import { Request, Response, NextFunction } from 'express';
import userService from '../../modules/users/user.service';
import workspaceService from '../../modules/workspace/workspace.service';
import boardRepository from '../../modules/boards/board.repository';
import boardService from '../../modules/boards/board.service';
import commentRepository from '../../modules/comments/comment.repository';

class RbacMiddleware {
    checkPermission(permission: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const userId = Number(req.user.id);
            
            const userPermissions = await userService.getPermissionsOfUser(userId);
            if(userPermissions.includes(permission)){
                return next();
            }
            res.status(403).json({
                status: 403,
                message: 'Access denied',
            });
        }
    }

    checkPermissionInBoard(permission: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const userId = Number(req.user.id);
            const boardId = Number(req.body.boardId);

            const userBoard = await boardService.findUserInBoard(userId, boardId);
            if(userBoard == true) {
                const userPermissions = await userService.getPermissionsOfUserInBoard(userId, boardId);
                if(userPermissions.includes(permission)) {
                    return next();
                }
                res.status(403).json({
                    status: 403,
                    message: 'Access denied',
                });
            }

            res.status(403).json({
                status: 403,
                message: 'User is not in this board.',
            });
        }
    }

    checkPermissionInWorkspace(permission: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const userId = Number(req.user.id);
            const workspaceId = Number(req.body.workspaceId);
            
            const userPermissions = await workspaceService.findUserOfWorkspace(userId, workspaceId);
            if(userPermissions){
                const userPermissions = await userService.getPermissionsOfUserInWorkspace(userId, workspaceId);
                if(userPermissions.includes(permission)){
                    return next();
                }
                res.status(403).json({
                    status: 403,
                    message: 'Access denied',
                });
            }

            res.status(403).json({
                status: 403,
                message: 'User is not in this workspace',
            });
        }
    }

    async isUserInBoard(req: Request, res: Response, next: NextFunction) {
        const userId = Number(req.user.id);               
        const boardId = Number(req.body.boardId);

        const userBoard = await boardService.findUserInBoard(userId, boardId);
        if(userBoard == true) {
            return next();
        }

        res.status(403).json({
            status: 403,
            message: 'User is not in this board.',
        });
    }

    async isUserInWorkspace(req: Request, res: Response, next: NextFunction) {
        const userId = Number(req.user.id);
        const workspaceId = Number(req.body.workspaceId);
            
        const userPermissions = await workspaceService.findUserOfWorkspace(userId, workspaceId);
        if(userPermissions){
            return next();
        }
        res.status(403).json({
            status: 403,
            message: 'User is not in this workspace',
        });
    }

    async isOwnerOfComment(req: Request, res: Response, next: NextFunction) {
        const userId = Number(req.user.id);
        const commentId = Number(req.params.id);

        const user = await commentRepository.getCommentOwner(commentId);
        if(user.id == userId){
            return next();
        }
        res.status(403).json({
            status: 403,
            message: 'Access denied',
        });
    }
}

export default new RbacMiddleware();