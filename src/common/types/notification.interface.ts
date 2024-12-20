export interface INotification {
    id: string;
    type: 'TASK_CREATED' | 'TASK_UPDATED' | 'COMMENT_ADDED';
    message: string;
    userId?: number;
    timestamp: Date;
}