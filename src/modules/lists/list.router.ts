import listController from "./list.controller";
import validate from "../../common/middleware/validate.middleware";
import express from "express";
import rbac from "../../common/middleware/rbac.middleware";
import check from "../../common/middleware/check.middleware";
import auth from "../../common/middleware/auth.middleware";
import { Permission } from "../../common/types/permission.enum";

const router = express.Router();

//admin he thong
router.get("/", auth.authenticateToken, rbac.checkPermission(Permission.GET_LIST), listController.findAllList);
router.get("/:id?", auth.authenticateToken, rbac.checkPermission(Permission.GET_LIST), listController.findByListId);

//user co trong board
router.post("/", auth.authenticateToken, validate.validateCreateList, rbac.checkPermissionInBoard(Permission.CREATE_LIST), listController.createList);
router.put("/:id?", auth.authenticateToken, validate.validateUpdateList, check.isListInBoard, rbac.checkPermissionInBoard(Permission.UPDATE_LIST), listController.updateList);
router.delete("/:id?", auth.authenticateToken, validate.validateDeleteList, check.isListInBoard, rbac.checkPermissionInBoard(Permission.DELETE_LIST), listController.deleteList);
router.get("/cards/:id?", auth.authenticateToken, rbac.isUserInBoard, listController.getListCards);

// router.post("/add-card", rbac.isUserInBoard, validate.validateAddCardToList, listController.addCardToList);
// router.delete("/remove-card", rbac.isUserInBoard, validate.validateRemoveCardFromList, listController.removeCardFromList);

export default router;