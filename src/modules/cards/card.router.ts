import cardController from "./card.controller";
import validate from "../../common/middleware/validate.middleware";
import rbac from "../../common/middleware/rbac.middleware";
import { Permission } from "../../common/types/permission.enum";
import auth from "../../common/middleware/auth.middleware";
import check from "../../common/middleware/check.middleware";
import express from "express";

const router = express.Router();

router.get("/", auth.authenticateToken, rbac.checkPermission(Permission.GET_CARD), cardController.findAllCard);
router.get("/:id?", auth.authenticateToken, rbac.checkPermission(Permission.GET_CARD), cardController.findCardById);

router.get("/users/:cardId?", auth.authenticateToken, rbac.isUserInBoard, cardController.getCardUsers);
router.get("/comments/:cardId?", auth.authenticateToken, rbac.isUserInBoard, cardController.getCardComments);
router.get("/attachments/:cardId?", auth.authenticateToken, rbac.isUserInBoard, cardController.getCardAttachments);

router.post("/", auth.authenticateToken, validate.validateCreateCard, rbac.checkPermissionInBoard(Permission.CREATE_CARD), cardController.createCard);
router.put("/:id?", auth.authenticateToken, validate.validateUpdateCard, check.isCardInBoard, rbac.checkPermissionInBoard(Permission.UPDATE_CARD), cardController.updateCard);
router.delete("/:id?", auth.authenticateToken, validate.validateDeleteCard, check.isCardInBoard, rbac.checkPermissionInBoard(Permission.DELETE_CARD), cardController.deleteCard);

router.post("/assign-user", auth.authenticateToken, validate.validateAssignUserToCard, rbac.checkPermissionInBoard(Permission.ASSIGN_USER_TO_CARD), cardController.assignUser);
router.delete("/remove-user", auth.authenticateToken, validate.validateRemoveUserFromCard, rbac.checkPermissionInBoard(Permission.REMOVE_USER_FROM_CARD), cardController.removeUser);

// router.post("/add-comment",  validate.validateAddCommentToCard, cardController.addComment);
// router.delete("/delete-comment", validate.validateRemoveCommentFromCard, cardController.removeComment);

// router.post("/add-attachment", validate.validateAddAttachmentToCard, cardController.addAttachment);
// router.delete("/delete-attachment", validate.validateRemoveAttachmentFromCard, cardController.removeAttachment);

export default router;