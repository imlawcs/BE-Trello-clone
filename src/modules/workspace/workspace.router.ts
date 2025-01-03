import workspaceController from "./workspace.controller";
import validate from "../../common/middleware/validate.middleware";
import rbac from "../../common/middleware/rbac.middleware";
import auth from "../../common/middleware/auth.middleware";
import { Permission } from "../../common/types/permission.enum";
import { Router } from "express";

const workspaceRouter = Router();

//admin he thong
workspaceRouter.get("/", auth.authenticateToken, rbac.checkPermission(Permission.GET_WORKSPACE), workspaceController.findAllWorkspace);

workspaceRouter.get("/:id?", auth.authenticateToken, rbac.checkPermission(Permission.GET_WORKSPACE), workspaceController.findByWorkspaceId);

//user co trong workspace
workspaceRouter.get("/users/:id?", auth.authenticateToken, rbac.isUserInWorkspace, workspaceController.getWorkspaceUsers);

//tat ca user
workspaceRouter.post("/", auth.authenticateToken, validate.validateCreateWorkspace, workspaceController.createWorkspace);

//owner workspace
workspaceRouter.post("/add-user", auth.authenticateToken, validate.validateAddUserToWorkspace, rbac.checkPermissionInWorkspace(Permission.ADD_USER_TO_WORKSPACE), workspaceController.addUserToWorkspace);

workspaceRouter.delete("/remove-user", auth.authenticateToken, validate.validateRemoveUserFromWorkspace, rbac.checkPermissionInWorkspace(Permission.REMOVE_USER_FROM_WORKSPACE), workspaceController.removeUserFromWorkspace);

workspaceRouter.put("/:id?", auth.authenticateToken, rbac.checkPermissionInWorkspace(Permission.UPDATE_WORKSPACE), workspaceController.updateWorkspace);

workspaceRouter.delete("/:id?", auth.authenticateToken, validate.validateUpdateWorkspace, rbac.checkPermissionInWorkspace(Permission.DELETE_WORKSPACE), workspaceController.deleteWorkspace);

workspaceRouter.post("/assign-role", auth.authenticateToken, validate.validateAssignRoleInWorkspace, rbac.checkPermissionInWorkspace(Permission.ASSIGN_ROLE_IN_WORKSPACE), workspaceController.assignRoleInWorkspace);

export default workspaceRouter;
