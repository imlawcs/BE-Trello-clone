import express from 'express';
import controller from '../roles/role.controller';
import auth from '../../common/middleware/auth.middleware';
import rbac from "../../common/middleware/rbac.middleware";
import { Permission } from '../../common/types/permission.enum'

const router = express.Router();

router.get('/get/:id?', auth.authenticateToken, rbac.checkPermission(Permission.GET_ROLE), controller.getRoles);
router.post("/create", auth.authenticateToken, rbac.checkPermission(Permission.CREATE_ROLE), controller.createRole);
router.put('/update/:id?', auth.authenticateToken, rbac.checkPermission(Permission.UPDATE_ROLE), controller.updateRole);
router.delete('/delete/:id?', auth.authenticateToken, rbac.checkPermission(Permission.DELETE_ROLE), controller.deleteRole);
router.get("/get-permission/:id?", auth.authenticateToken, rbac.checkPermission(Permission.GET_PERMISSION), controller.getPermissionsByRoleId);
router.delete("/delete-permission", rbac.checkPermission(Permission.DELETE_PERMISSION_FROM_ROLE), controller.deletePermissionOfRole);
router.post("/assign-permission", auth.authenticateToken, rbac.checkPermission(Permission.ASSIGN_PERMISSION), controller.assignPermission);

export default router;