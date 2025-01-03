import activityController from "./activity.controller";
import { Router } from "express";
import validate from "../../common/middleware/validate.middleware";
import rbac from "../../common/middleware/rbac.middleware";
import auth from "../../common/middleware/auth.middleware";
import { Permission } from "../../common/types/permission.enum";

const router = Router();

router.post("/", auth.authenticateToken, validate.validateCreateActivity, activityController.createActivity);
router.get("/board/:boardId?", auth.authenticateToken, rbac.isUserInBoard, activityController.getActivityLogsOfBoard);
router.get("/card/:cardId?", auth.authenticateToken, rbac.isUserInBoard, activityController.getActivityLogsOfCard);

export default router;