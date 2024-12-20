import commentController from "./comment.controller";
import express from "express";
import validate from "../../common/middleware/validate.middleware";
import rbac from "../../common/middleware/rbac.middleware";
import { Permission } from "../../common/types/permission.enum";

const router = express.Router();

router.get("/:id?", rbac.checkPermission(Permission.GET_COMMENT), commentController.findCommentById);

router.post("/", rbac.checkPermissionInBoard(Permission.CREATE_COMMENT), validate.validateCreateComment, commentController.createComment);
router.put("/:id?", rbac.isOwnerOfComment, validate.validateUpdateComment, commentController.updateComment);
router.delete("/:id?", rbac.isOwnerOfComment, commentController.deleteComment);

export default router;