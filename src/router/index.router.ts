import express from 'express';
import userRouter from '../modules/users/user.router';
import roleRouter from '../modules/roles/role.router';
import authRouter from '../modules/auth/auth.router';
import permissionRouter from '../modules/permissions/permission.router';
import path from 'path';


const app = express();
const router = express.Router();

const routes = [
    { path: '/users', router: userRouter },
    { path: '/roles', router: roleRouter },
    { path: '/auth', router: authRouter },
    { path: '/permissions', router: permissionRouter }
];

routes.forEach(({ path, router }) => {
    router.use(path, router);
});

app.use('/api', router);

export default app;
