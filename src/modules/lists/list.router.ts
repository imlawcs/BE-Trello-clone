import listController from "./list.controller";
import express from "express";

const router = express.Router();

router.get("/", listController.findAllList);
router.get("/:name", listController.findByName);
router.get("/:id", listController.findByListId);
router.post("/", listController.createList);
router.put("/:id", listController.updateList);
router.delete("/:id", listController.deleteList);
router.get("/:id/cards", listController.getListCards);
router.post("/add-card", listController.addCardToList);
router.delete("/remove-card", listController.removeCardFromList);

export default router;