import express from "express";
import controller from '../auth/auth.controller'; 
import validate from '../../common/middleware/validate.middleware';
import auth from '../../common/middleware/auth.middleware';

const router = express.Router();

router.post("/register", validate.validateRegister, controller.register);
router.post("/login", validate.validateLogin, controller.login);
router.get("/me", auth.authenticateToken, controller.getMe);

export default router;
