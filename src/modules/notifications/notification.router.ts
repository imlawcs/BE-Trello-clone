import express from 'express';
import notificationController from './notification.controller';
import validate from '../../common/middleware/validate.middleware';

const router = express.Router();

router.get('/stream/:userId?', notificationController.setupSSE);
router.post('/send', validate.validateCreateNotification, notificationController.sendNotification);
router.get('/clients/count', notificationController.getConnectedClientsCount);
router.get('/clients', notificationController.getConnectedClients);
router.post('/send/all', validate.validateCreateNotification, notificationController.sendNotificationToAll);
router.get('/users/:userId?', notificationController.getNotificationOfUser);
router.put("/mark-read/:notificationId?", notificationController.markNotificationAsRead);

export default router;