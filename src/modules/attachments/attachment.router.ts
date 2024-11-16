import attachmentController from "./attachment.controller";
import e, { Router } from "express";

const router = Router();

router.post("/", attachmentController.createAttachment);
router.get("/:id", attachmentController.findAttachmentById);
router.put("/:id", attachmentController.updateAttachment);
router.delete("/:id", attachmentController.deleteAttachment);

export default router;