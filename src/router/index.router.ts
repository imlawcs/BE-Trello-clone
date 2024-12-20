import express from 'express';
import userRouter from '../modules/users/user.router';
import roleRouter from '../modules/roles/role.router';
import authRouter from '../modules/auth/auth.router';
import permissionRouter from '../modules/permissions/permission.router';
import workspaceRouter from '../modules/workspace/workspace.router';
import boardRouter from '../modules/boards/board.router';
import listRouter from '../modules/lists/list.router';
import cardRouter from '../modules/cards/card.router';
import attachmentRouter from '../modules/attachments/attachment.router';
import commentRouter from '../modules/comments/comment.router';
import notificationRouter from '../modules/notifications/notification.router';
import checklistRouter from '../modules/checklists/checklist.router';
import activityRouter from '../modules/activitylogs/activity.router';
import path from 'path';

const app = express();
const router = express.Router();

const routes = [
    { path: '/users', route: userRouter },
    { path: '/roles', route: roleRouter },
    { path: '/auth', route: authRouter },
    { path: '/permissions', route: permissionRouter },
    { path: '/workspaces', route: workspaceRouter },
    { path: '/boards', route: boardRouter },
    { path: '/lists', route: listRouter },
    { path: '/cards', route: cardRouter },
    { path: '/attachments', route: attachmentRouter },
    { path: '/comments', route: commentRouter },
    { path: '/notifications', route: notificationRouter },
    { path: '/checklists', route: checklistRouter },
    { path: '/activitylogs', route: activityRouter }
];

routes.forEach(({ path, route }) => {
    router.use(path, route);
});

app.use('/api', router);

export default app;
