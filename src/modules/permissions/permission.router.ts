import express from "express";
import controller from "./permission.controller";
import auth from "../../common/middleware/auth.middleware";
import rbac from "../../common/middleware/rbac.middleware";
import { Permission } from "../../common/types/permission.enum";


const router = express.Router();

router.post("/create", auth.authenticateToken, rbac.checkPermission(Permission.CREATE_PERMISSION), controller.createPermission);

export default router;
