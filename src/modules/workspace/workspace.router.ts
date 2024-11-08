import workspaceController from "./workspace.controller";
import validate from "../../common/middleware/validate.middleware";
import { Router } from "express";

const workspaceRouter = Router();

workspaceRouter.get("/get", workspaceController.findAllWorkspace);
workspaceRouter.get("/get/:name?", workspaceController.findByName);
workspaceRouter.get("/get/:id?", workspaceController.findByWorkspaceId);
workspaceRouter.get("/users/:id?", workspaceController.getWorkspaceUsers);
// workspaceRouter.get("/boards/:id", workspaceController.getWorkspaceBoards);
workspaceRouter.post("/create", validate.validateCreateWorkspace, workspaceController.createWorkspace);
workspaceRouter.post("/add-user", validate.validateAddUserToWorkspace, workspaceController.addUserToWorkspace);
workspaceRouter.delete("/remove-user", validate.validateRemoveUserFromWorkspace, workspaceController.removeUserFromWorkspace);
// workspaceRouter.post("/add-board", workspaceController.addBoardToWorkspace);
// workspaceRouter.delete("/remove-board", workspaceController.removeBoardFromWorkspace);
workspaceRouter.put("/update/:id?", validate.validateUpdateWorkspace, workspaceController.updateWorkspace);
workspaceRouter.delete("/delete/:id?", workspaceController.deleteWorkspace);

export default workspaceRouter;
