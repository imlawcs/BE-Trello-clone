import cardController from "./card.controller";
import validate from "../../common/middleware/validate.middleware";
import rbac from "../../common/middleware/rbac.middleware";
import { Permission } from "../../common/types/permission.enum";
import auth from "../../common/middleware/auth.middleware";
import check from "../../common/middleware/check.middleware";
import express from "express";

const router = express.Router();

router.get("/", rbac.checkPermission(Permission.GET_CARD), cardController.findAllCard);
router.get("/:id?", rbac.checkPermission(Permission.GET_CARD), cardController.findCardById);

router.get("/users/:cardId?", rbac.isUserInBoard, cardController.getCardUsers);
router.get("/comments/:cardId?", rbac.isUserInBoard, cardController.getCardComments);
router.get("/attachments/:cardId?", rbac.isUserInBoard, cardController.getCardAttachments);

router.post("/", rbac.checkPermissionInBoard(Permission.CREATE_CARD), cardController.createCard);
router.put("/:id?", check.isCardInBoard, rbac.checkPermissionInBoard(Permission.UPDATE_CARD), validate.validateUpdateCard, cardController.updateCard);
router.delete("/:id?", check.isCardInBoard, rbac.checkPermissionInBoard(Permission.DELETE_CARD), validate.validateDeleteCard, cardController.deleteCard);

router.post("/assign-user", rbac.checkPermissionInBoard(Permission.ASSIGN_USER_TO_CARD), validate.validateAssignUserToCard, cardController.assignUser);
router.delete("/remove-user", rbac.checkPermissionInBoard(Permission.REMOVE_USER_FROM_CARD), validate.validateRemoveUserFromCard, cardController.removeUser);

// router.post("/add-comment",  validate.validateAddCommentToCard, cardController.addComment);
// router.delete("/delete-comment", validate.validateRemoveCommentFromCard, cardController.removeComment);

// router.post("/add-attachment", validate.validateAddAttachmentToCard, cardController.addAttachment);
// router.delete("/delete-attachment", validate.validateRemoveAttachmentFromCard, cardController.removeAttachment);

export default router;