import listController from "./list.controller";
import validate from "../../common/middleware/validate.middleware";
import express from "express";

const router = express.Router();

router.get("/get/", listController.findAllList);
router.get("/get/:name", listController.findByName);
router.get("/get/:id?", listController.findByListId);
router.post("/create/", validate.validateCreateList, listController.createList);
router.put("/update/:id?", validate.validateUpdateList, listController.updateList);
router.delete("/delete/:id?", listController.deleteList);
router.get("/cards/:id?", listController.getListCards);
router.post("/add-card", validate.validateAddCardToList, listController.addCardToList);
router.delete("/remove-card", validate.validateRemoveCardFromList, listController.removeCardFromList);

export default router;