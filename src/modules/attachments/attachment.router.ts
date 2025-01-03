import attachmentController from "./attachment.controller";
import { Router } from "express";
import validate from "../../common/middleware/validate.middleware";
import rbac from "../../common/middleware/rbac.middleware";
import { Permission } from "../../common/types/permission.enum";
import { upload } from "../../common/middleware/upload.middleware";
import auth from "../../common/middleware/auth.middleware";

const router = Router();

router.post("/upload/:id?/:cardId?", auth.authenticateToken, rbac.checkPermissionInBoard(Permission.CREATE_ATTACHMENT), upload.single("file"), attachmentController.uploadFile);
// router.get("/:id?", attachmentController.findAttachmentById);
// router.post("/", validate.validateCreateAttachment, attachmentController.createAttachment);
// router.put("/:id?", validate.validateUpdateAttachment, attachmentController.updateAttachment);
router.delete("/:id?", auth.authenticateToken, rbac.checkPermissionInBoard(Permission.DELETE_ATTACHMENT), attachmentController.deleteAttachment);

export default router;