import commentController from "./comment.controller";
import express from "express";

const router = express.Router();

router.get("/:id", commentController.findCommentById);
router.post("/", commentController.createComment);
router.delete("/:id", commentController.deleteComment);
router.put("/:id", commentController.updateComment);

export default router;