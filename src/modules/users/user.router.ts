import express from 'express';
import controller from '../users/user.controller';
import auth from '../../common/middleware/auth.middleware';
import rbac from "../../common/middleware/rbac.middleware";
import validate from "../../common/middleware/validate.middleware";
import { Permission } from '../../common/types/permission.enum'

const router = express.Router();

router.get('/get/:id?', auth.authenticateToken, rbac.checkPermission(Permission.GET_USER), controller.getUsers);
// router.get('/get-by-role/:roleName', auth.authenticateToken, rbac.checkPermission(Permission.GET_USER), controller.getUserByRoleName);
router.put('/update/:id?', auth.authenticateToken, validate.validateUpdateUser, rbac.checkPermission(Permission.UPDATE_USER), controller.updateUser);
router.delete('/delete/:id?', auth.authenticateToken, rbac.checkPermission(Permission.DELETE_USER), controller.deleteUser);
router.post("/assign-role", auth.authenticateToken, validate.validateAssignRole, rbac.checkPermission(Permission.ASSIGN_ROLE), controller.assignRole);
router.post("/remove-role", auth.authenticateToken, validate.validateRemoveRole, rbac.checkPermission(Permission.REMOVE_ROLE), controller.removeRole);
router.get("/get-permissions/:id?", auth.authenticateToken, rbac.checkPermission(Permission.GET_PERMISSION), controller.getPermissionsOfUser);
router.get("/get-roles/:id?", auth.authenticateToken, rbac.checkPermission(Permission.GET_ROLE), controller.getRolesOfUser);


export default router;