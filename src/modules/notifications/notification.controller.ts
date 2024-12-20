import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import notificationService from './notification.service';
import { INotification } from '../../common/types/notification.interface';
import userRepository from '../users/user.repository';
import customError from '../../common/error/customError';
import { Notification } from '../../database/entities/notification';

class NotificationController {  

    public async setupSSE(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.params.userId); 
            
            if(!userId) {
                throw new customError(400, 'User ID is required');
            }

            const user = userRepository.findByUserId(userId);
            if (!user) {
                throw new customError(404, 'User not found');
            }

            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*'
            });

            res.write(`data: ${JSON.stringify({ type: 'CONNECTED' })}\n\n`);

            const heartbeat = setInterval(() => {
                res.write('\n\n');
            }, 30000);

            const result = await notificationService.addClient(userId, res);
            res.write(`data: ${JSON.stringify({ type: 'NOTIFICATION', message: result.message })}\n\n`);

            req.on('close', async() => {
                clearInterval(heartbeat);
                await notificationService.removeClient(userId);
            });
        }
        catch (error) {
            next(error);
        }
    };

    public async sendNotification (req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, type, message } = req.body;

            const user = await userRepository.findByUserId(userId);
            if (!user) {
                throw new customError(404, 'User not found');
            }

            const notification: INotification = {
                id: uuidv4(),
                type,
                message,
                userId,
                timestamp: new Date()
            };

            const result = await notificationService.sendNotificationToUser(notification);

            const notificationToSave : Notification = {
                title: notification.type,
                description: notification.message,
                user : user,
                createdAt: notification.timestamp,
                isRead: false
            }

            await notificationService.saveNotificationToDB(notificationToSave);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    public async sendNotificationToAll (req: Request, res: Response, next: NextFunction) {
        try {
            const { type, message } = req.body;

            const notification: INotification = {
                id: uuidv4(),
                type,
                message,
                timestamp: new Date()
            };

            const result = await notificationService.sendNotificationToAll(notification);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    public getConnectedClients (req: Request, res: Response, next: NextFunction) {
        try {
            const clients = notificationService.getConnectedClients();
            res.status(200).json(clients);
        } catch (error) {
            next(error);
        }
    };

    public getConnectedClientsCount (req: Request, res: Response, next: NextFunction) {
        try {
            const count = notificationService.getConnectedClientsCount();
            res.json({ count });    
        } catch (error) {
            next(error);
        }
    };

    public async getNotificationOfUser (req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.params.userId);

            if(!userId) {
                throw new customError(400, 'User ID is required');
            }

            const user = await userRepository.findByUserId(userId);
            if (!user) {
                throw new customError(404, 'User not found');
            }

            const notifications = await notificationService.getNotificationOfUser(userId);
            res.status(200).json(notifications);
        } catch (error) {
            next(error);
        }
    };

    public async markNotificationAsRead (req: Request, res: Response, next: NextFunction) {
        try {
            const notificationId = req.params.notificationId;

            if(!notificationId) {
                throw new customError(400, 'Notification ID is required');
            }

            const notification = await notificationService.markNotificationAsRead(Number(notificationId));
            res.status(200).json(notification);
        } catch (error) {
            next(error);
        }
    };
}

export default new NotificationController();