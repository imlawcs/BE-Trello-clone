import checklistController from "./checklist.controller";
import validate from "../../common/middleware/validate.middleware";
import express from "express";
import rbac from "../../common/middleware/rbac.middleware";
import { Permission } from "../../common/types/permission.enum";

const router = express.Router();

router.get("/:id?", checklistController.getChecklistById);
router.get("/card/:cardId?", rbac.isUserInBoard, checklistController.getAllChecklistsOfCard);
router.post("/", rbac.isUserInBoard, validate.validateCreateChecklist, checklistController.createChecklist);
router.put("/:id?", rbac.isUserInBoard, validate.validateUpdateChecklist, checklistController.updateChecklist);
router.delete("/:id?", rbac.isUserInBoard, validate.validateDeleteChecklist, checklistController.deleteChecklist);

export default router;