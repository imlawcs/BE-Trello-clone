import { Response } from 'express';
import { EventEmitter } from 'events';
import { v4 as UUID } from 'uuid';
import { INotification } from '../../common/types/notification.interface';
import customError from '../../common/error/customError';
import { Result } from '../../common/response/Result';
import { dbSource } from '../../config/ormconfig';
import { Notification } from '../../database/entities/notification';
import { User } from '../../database/entities/user';

class NotificationService {
    private eventEmitter: EventEmitter;
    private clients: Map<number, Response>;

    public constructor() {
        this.eventEmitter = new EventEmitter();
        this.clients = new Map();
    }

    public async addClient(userId: number, res: Response): Promise<Result> {
        if (this.clients.has(userId)) {
            console.warn(`Client already connected for userId: ${userId}`);
            return new Result(false, 400, 'Client already connected');
        }
    
        console.log(`Client connected: ${userId}`);
        this.clients.set(userId, res);
        return new Result(true, 200, 'Client connected successfully');
    }
    

    public async removeClient(userId: number): Promise<Result> {
        try {
            if (!this.clients.has(userId)) {
                throw new customError(404, 'Client not found');
            }
            console.log(`Client disconnected: ${userId}`);
            this.clients.delete(userId);
            return new Result(true, 200, 'Client disconnected successfully');
        }
        catch (error) {
            throw error;
        }
    }

    public async sendNotificationToUser(notification: INotification): Promise<Result> {
        try {
            if (notification.userId === undefined) {
                throw new customError(400, 'Notification userId is undefined.');
            }

            // await this.saveNotificationToDB(notification);
            const client = this.clients.get(notification.userId);
            if (!client) {
                throw new customError(404, 'User is not connected.');
            }
            
            client.write(`data: ${JSON.stringify(notification)}\n\n`);
            return new Result(true, 200, 'Notification sent successfully');
        } catch (error) {
            throw error;
        }        
    }

    public async saveNotificationToDB(notification: Notification): Promise<Result> {
        try {
            const connection = await dbSource.getRepository(Notification).save(notification);
            return new Result(true, 200, 'Notification saved to DB successfully');
        } catch (error) {
            throw error;
        }
    }

    public async sendNotificationToAll(notification: INotification): Promise<Result> {
        try {
            if (this.clients.size == 0) {
                throw new customError(404, 'No clients connected');
            }
            this.clients.forEach(async (client, key) => {
                client.write(`data: ${JSON.stringify(notification)}\n\n`);
                const userExists = await dbSource.getRepository(User).findOne({ where: { id: key } });
                const notificationToSave : Notification = {
                    title: notification.type,
                    description: notification.message,
                    user : userExists!,
                    createdAt: notification.timestamp,
                    isRead: false
                }
                await this.saveNotificationToDB(notificationToSave);
            });
            return new Result(true, 200, 'Notification sent successfully');
        }
        catch (error) {
            throw error;
        }
    }

    public getConnectedClients(): Result {
        const allClients = this.clients;
        if (allClients.size == 0) {
            throw new customError(404, 'No clients connected');
        }
        return new Result(true, 200, 'Get connected clients successfully', { userId : Array.from(allClients.keys()) });
    }

    public getConnectedClientsCount(): number {
        try {
            const count = this.clients.size;
            if (count == 0) {
                throw new customError(404, 'No clients connected');
            }
            return count;
        }
        catch (error) {
            throw error;
        }
    }

    public async getNotificationOfUser(userId: number): Promise<Result> {
        try {
            const notifications = await dbSource.getRepository(Notification).find({ where: { user: { id: userId } } });
            console.log(notifications);
            
            return new Result(true, 200, 'Get notifications successfully', notifications);
        }
        catch (error) {
            throw error;
        }
    }

    public async markNotificationAsRead(notificationId: number): Promise<Result> {
        try {
            const notification = await dbSource.getRepository(Notification).findOne({ where: { id: notificationId } });
            if (!notification) {
                throw new customError(404, 'Notification not found');
            }
            notification!.isRead = true;
            await dbSource.getRepository(Notification).save(notification);
            return new Result(true, 200, 'Notification marked as read successfully');
        }
        catch (error) {
            throw error;
        }
    }
}

export default new NotificationService();