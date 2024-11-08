import boardController from "./board.controller";
import validate from "../../common/middleware/validate.middleware";
import express from "express";
import { Router } from "express";

const router = Router();

router.get("/get/", boardController.findAllBoard);
router.get("/get/:name?", boardController.findByName);
router.get("/get/:id?", boardController.findByBoardId);
router.get("/lists/:id?", boardController.getBoardLists);
router.post("/create", validate.validateCreateBoard, boardController.createBoard);
router.put("/update/:id?", validate.validateUpdateBoard, boardController.updateBoard);
router.delete("/delete/:id?", boardController.deleteBoard);
router.post("/add-list", validate.validateAddListToBoard, boardController.addListToBoard);
router.delete("/remove-list", validate.validateRemoveListFromBoard, boardController.removeListFromBoard);

export default router;

