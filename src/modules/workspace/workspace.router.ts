import workspaceController from "./workspace.controller";
import { Router } from "express";

const workspaceRouter = Router();

workspaceRouter.get("/", workspaceController.findAllWorkspace);
workspaceRouter.get("/:name", workspaceController.findByName);
workspaceRouter.get("/:id", workspaceController.findByWorkspaceId);
workspaceRouter.post("/", workspaceController.createWorkspace);
workspaceRouter.post("/:workspaceId/:userId", workspaceController.addUserToWorkspace);
workspaceRouter.delete("/:workspaceId/:userId", workspaceController.removeUserFromWorkspace);
workspaceRouter.put("/", workspaceController.updateWorkspace);
workspaceRouter.delete("/:id", workspaceController.deleteWorkspace);

export default workspaceRouter;
