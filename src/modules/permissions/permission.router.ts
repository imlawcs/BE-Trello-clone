import express from "express";
import controller from "./permission.controller";
import auth from "../../common/middleware/auth.middleware";
import rbac from "../../common/middleware/rbac.middleware";
import validate from "../../common/middleware/validate.middleware";
import { Permission } from "../../common/types/permission.enum";


const router = express.Router();

router.post("/create", auth.authenticateToken, validate.validateCreatePermission, rbac.checkPermission(Permission.CREATE_PERMISSION), controller.createPermission);
router.get("/get/:id?", auth.authenticateToken, rbac.checkPermission(Permission.GET_PERMISSION), controller.getPermissions);
router.put("/update/:id?", auth.authenticateToken, validate.validateUpdatePermission, rbac.checkPermission(Permission.UPDATE_PERMISSION), controller.updatePermission);
router.delete("/delete/:id?", auth.authenticateToken, rbac.checkPermission(Permission.DELETE_PERMISSION), controller.deletePermission);

export default router;