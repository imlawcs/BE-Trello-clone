import boardController from "./board.controller";
import validate from "../../common/middleware/validate.middleware";
import rbac from "../../common/middleware/rbac.middleware";
import check from "../../common/middleware/check.middleware";
import auth from "../../common/middleware/auth.middleware";
import { Permission } from "../../common/types/permission.enum";
import { Router } from "express";

const router = Router();

//admin he thong
router.get("/", auth.authenticateToken, rbac.checkPermission(Permission.GET_BOARD), boardController.findAllBoard);
router.get("/:id?", auth.authenticateToken, rbac.checkPermission(Permission.GET_BOARD), boardController.findByBoardId);

//user co trong board
router.get("/lists/:id?", auth.authenticateToken, rbac.isUserInBoard, boardController.getBoardLists);
router.get("/users/:id?", auth.authenticateToken, rbac.isUserInBoard, boardController.getBoardUsers);

//tat ca user
router.post("/", auth.authenticateToken, validate.validateCreateBoard, rbac.checkPermissionInWorkspace(Permission.CREATE_BOARD), boardController.createBoard);

//owner board
router.put("/:id?", auth.authenticateToken, validate.validateUpdateBoard, check.isBoardInWorkspace, rbac.checkPermissionInBoard(Permission.UPDATE_BOARD), boardController.updateBoard);
router.delete("/:id?", auth.authenticateToken, validate.validateDeleteBoard, check.isBoardInWorkspace, rbac.checkPermissionInBoard(Permission.DELETE_BOARD), check.isBoardInWorkspace, boardController.deleteBoard);
router.post("/assign-role", auth.authenticateToken, validate.validateAssignRoleInBoard, rbac.checkPermissionInBoard(Permission.ASSIGN_ROLE_IN_BOARD), boardController.assignRoleInBoard);

//user co trong board
router.post("/add-user", auth.authenticateToken, validate.validateAddUserToBoard, rbac.checkPermissionInBoard(Permission.ADD_USER_TO_BOARD), boardController.addUserToBoard);
router.delete("/remove-user", auth.authenticateToken, validate.validateRemoveUserFromBoard, rbac.checkPermissionInBoard(Permission.REMOVE_USER_FROM_BOARD), boardController.removeUserFromBoard);

export default router;

