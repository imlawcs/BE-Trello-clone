import workspaceController from "./workspace.controller";
import { Router } from "express";

const workspaceRouter = Router();

workspaceRouter.get("/get", workspaceController.findAllWorkspace);
workspaceRouter.get("/get/:name?", workspaceController.findByName);
workspaceRouter.get("/get/:id?", workspaceController.findByWorkspaceId);
workspaceRouter.post("/create", workspaceController.createWorkspace);
workspaceRouter.post("/add-user", workspaceController.addUserToWorkspace);
workspaceRouter.delete("/remove-user", workspaceController.removeUserFromWorkspace);
workspaceRouter.put("/update/:id?", workspaceController.updateWorkspace);
workspaceRouter.delete("/delete/:id?", workspaceController.deleteWorkspace);

export default workspaceRouter;
