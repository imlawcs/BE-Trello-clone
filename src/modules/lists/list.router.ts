import listController from "./list.controller";
import validate from "../../common/middleware/validate.middleware";
import express from "express";
import rbac from "../../common/middleware/rbac.middleware";
import check from "../../common/middleware/check.middleware";
import { Permission } from "../../common/types/permission.enum";

const router = express.Router();

//admin he thong
router.get("/", rbac.checkPermission(Permission.GET_LIST), listController.findAllList);
router.get("/:id?", rbac.checkPermission(Permission.GET_LIST), listController.findByListId);

//user co trong board
router.post("/", rbac.checkPermissionInBoard(Permission.CREATE_LIST), validate.validateCreateList, listController.createList);
router.put("/:id?", check.isListInBoard, rbac.checkPermissionInBoard(Permission.UPDATE_LIST), validate.validateUpdateList, listController.updateList);
router.delete("/:id?", check.isListInBoard, rbac.checkPermissionInBoard(Permission.DELETE_LIST), listController.deleteList);
router.get("/cards/:id?", rbac.isUserInBoard, validate.validateDeleteList, listController.getListCards);

// router.post("/add-card", rbac.isUserInBoard, validate.validateAddCardToList, listController.addCardToList);
// router.delete("/remove-card", rbac.isUserInBoard, validate.validateRemoveCardFromList, listController.removeCardFromList);

export default router;