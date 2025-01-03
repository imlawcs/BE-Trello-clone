import commentController from "./comment.controller";
import express from "express";
import validate from "../../common/middleware/validate.middleware";
import rbac from "../../common/middleware/rbac.middleware";
import auth from "../../common/middleware/auth.middleware";
import { Permission } from "../../common/types/permission.enum";

const router = express.Router();

router.get("/:id?", auth.authenticateToken, rbac.checkPermission(Permission.GET_COMMENT), commentController.findCommentById);

router.post("/", auth.authenticateToken, validate.validateCreateComment, rbac.checkPermissionInBoard(Permission.CREATE_COMMENT), commentController.createComment);
router.put("/:id?", auth.authenticateToken, validate.validateUpdateComment, rbac.isOwnerOfComment, commentController.updateComment);
router.delete("/:id?", auth.authenticateToken, rbac.isOwnerOfComment, commentController.deleteComment);

export default router;