import cardController from "./card.controller";
import validate from "../../common/middleware/validate.middleware";
import express from "express";

const router = express.Router();

router.get("/get", cardController.findAllCard);
router.get("/get/:name", cardController.findByName);
router.get("/get/:id", cardController.findCardById);
router.post("/create/", cardController.createCard);
router.put("/update/:id", cardController.updateCard);
router.delete("/delete/:id", cardController.deleteCard);
// router.get("/cards/:listId", cardController.getListCards);
router.post("/add-card", cardController.addCardToList);
router.delete("/remove-card", cardController.removeCardFromList);

export default router;