import activityController from "./activity.controller";
import { Router } from "express";
import validate from "../../common/middleware/validate.middleware";
import rbac from "../../common/middleware/rbac.middleware";
import { Permission } from "../../common/types/permission.enum";

const router = Router();

router.post("/", validate.validateCreateActivity, activityController.createActivity);
router.get("/board/:boardId?", rbac.isUserInBoard, activityController.getActivityLogsOfBoard);
router.get("/card/:cardId?", rbac.isUserInBoard, activityController.getActivityLogsOfCard);

export default router;