import boardController from "./board.controller";
import express from "express";
import { Router } from "express";

const router = Router();

router.get("/", boardController.findAllBoard);
router.get("/:name?", boardController.findByName);
router.get("/:id?", boardController.findByBoardId);
router.post("/", boardController.createBoard);
router.put("/:id", boardController.updateBoard);
router.delete("/:id", boardController.deleteBoard);
router.post("/add-list", boardController.addListToBoard);
router.delete("/remove-list", boardController.removeListFromBoard);
router.get("/lists/:id", boardController.getBoardLists);

export default router;

