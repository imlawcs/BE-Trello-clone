import express from 'express';
import userRouter from '../modules/users/user.router';
import roleRouter from '../modules/roles/role.router';
import authRouter from '../modules/auth/auth.router';
import permissionRouter from '../modules/permissions/permission.router';
import path from 'path';


const app = express();
const router = express.Router();

const routes = [
    { path: '/users', route: userRouter },
    { path: '/roles', route: roleRouter },
    { path: '/auth', route: authRouter },
    { path: '/permissions', route: permissionRouter }
];

routes.forEach(({ path, route }) => {
    router.use(path, route);
});

app.use('/api', router);

export default app;
