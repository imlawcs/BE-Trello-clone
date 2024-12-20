import boardController from "./board.controller";
import validate from "../../common/middleware/validate.middleware";
import rbac from "../../common/middleware/rbac.middleware";
import check from "../../common/middleware/check.middleware";
import { Permission } from "../../common/types/permission.enum";
import { Router } from "express";

const router = Router();

//admin he thong
router.get("/", rbac.checkPermission(Permission.GET_BOARD), boardController.findAllBoard);
router.get("/:id?", rbac.checkPermission(Permission.GET_BOARD), boardController.findByBoardId);

//user co trong board
router.get("/lists/:id?", rbac.isUserInBoard, boardController.getBoardLists);
router.get("/users/:id?", rbac.isUserInBoard, boardController.getBoardUsers);

//tat ca user
router.post("/", rbac.checkPermissionInWorkspace(Permission.CREATE_BOARD), validate.validateCreateBoard, boardController.createBoard);

//owner board
router.put("/:id?", check.isBoardInWorkspace, rbac.checkPermissionInBoard(Permission.UPDATE_BOARD), validate.validateUpdateBoard, boardController.updateBoard);
router.delete("/:id?", check.isBoardInWorkspace, rbac.checkPermissionInBoard(Permission.DELETE_BOARD), check.isBoardInWorkspace, validate.validateDeleteBoard, boardController.deleteBoard);

//user co trong board
router.post("/add-user", rbac.checkPermissionInBoard(Permission.ADD_USER_TO_BOARD), validate.validateAddUserToBoard, boardController.addUserToBoard);
router.delete("/remove-user", rbac.checkPermissionInBoard(Permission.REMOVE_USER_FROM_BOARD), validate.validateRemoveUserFromBoard, boardController.removeUserFromBoard);

export default router;

