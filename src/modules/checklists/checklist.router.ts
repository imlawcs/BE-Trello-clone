import checklistController from "./checklist.controller";
import validate from "../../common/middleware/validate.middleware";
import express from "express";
import rbac from "../../common/middleware/rbac.middleware";
import auth from "../../common/middleware/auth.middleware";

const router = express.Router();

router.get("/:id?", auth.authenticateToken, checklistController.getChecklistById);
router.get("/card/:cardId?", auth.authenticateToken, rbac.isUserInBoard, checklistController.getAllChecklistsOfCard);
router.post("/", auth.authenticateToken, validate.validateCreateChecklist, rbac.isUserInBoard, checklistController.createChecklist);
router.put("/:id?", auth.authenticateToken, validate.validateUpdateChecklist, rbac.isUserInBoard, checklistController.updateChecklist);
router.delete("/:id?", auth.authenticateToken, validate.validateDeleteChecklist, rbac.isUserInBoard, checklistController.deleteChecklist);

export default router;