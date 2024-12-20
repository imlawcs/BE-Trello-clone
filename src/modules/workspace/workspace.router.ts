import workspaceController from "./workspace.controller";
import validate from "../../common/middleware/validate.middleware";
import rbac from "../../common/middleware/rbac.middleware";
import { Permission } from "../../common/types/permission.enum";
import { Router } from "express";

const workspaceRouter = Router();

//admin he thong
workspaceRouter.get("/", rbac.checkPermission(Permission.GET_WORKSPACE), workspaceController.findAllWorkspace);

workspaceRouter.get("/:id?", rbac.checkPermission(Permission.GET_WORKSPACE), workspaceController.findByWorkspaceId);

//user co trong workspace
workspaceRouter.get("/users/:id?", rbac.isUserInWorkspace, workspaceController.getWorkspaceUsers);

//tat ca user
workspaceRouter.post("/", validate.validateCreateWorkspace, workspaceController.createWorkspace);

//owner workspace
workspaceRouter.post("/add-user", rbac.checkPermissionInWorkspace(Permission.ADD_USER_TO_WORKSPACE), validate.validateAddUserToWorkspace, workspaceController.addUserToWorkspace);

workspaceRouter.delete("/remove-user", rbac.checkPermissionInWorkspace(Permission.REMOVE_USER_FROM_WORKSPACE), validate.validateRemoveUserFromWorkspace, workspaceController.removeUserFromWorkspace);

workspaceRouter.put("/:id?", rbac.checkPermissionInWorkspace(Permission.UPDATE_WORKSPACE), validate.validateUpdateWorkspace, workspaceController.updateWorkspace);

workspaceRouter.delete("/:id?", rbac.checkPermissionInWorkspace(Permission.DELETE_WORKSPACE), workspaceController.deleteWorkspace);

export default workspaceRouter;
