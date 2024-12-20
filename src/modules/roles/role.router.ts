import express from 'express';
import controller from '../roles/role.controller';
import auth from '../../common/middleware/auth.middleware';
import rbac from "../../common/middleware/rbac.middleware";
import validate from "../../common/middleware/validate.middleware";
import { Permission } from '../../common/types/permission.enum'

const router = express.Router();

router.get('/:id?', auth.authenticateToken, rbac.checkPermission(Permission.GET_ROLE), controller.getRoles);
router.post("/", auth.authenticateToken, validate.validateCreateRole, rbac.checkPermission(Permission.CREATE_ROLE), controller.createRole);
router.put('/:id?', auth.authenticateToken, validate.validateUpdateRole, rbac.checkPermission(Permission.UPDATE_ROLE), controller.updateRole);
router.delete('/:id?', auth.authenticateToken, rbac.checkPermission(Permission.DELETE_ROLE), controller.deleteRole);
router.get("/get-permission/:id?", auth.authenticateToken, rbac.checkPermission(Permission.GET_PERMISSION), controller.getPermissionsByRoleId);
router.delete("/remove-permission", auth.authenticateToken, validate.validateRemovePermission, rbac.checkPermission(Permission.DELETE_PERMISSION_FROM_ROLE), controller.deletePermissionOfRole);
router.post("/assign-permission", auth.authenticateToken, validate.validateAssignPermission, rbac.checkPermission(Permission.ASSIGN_PERMISSION), controller.assignPermission);

export default router;