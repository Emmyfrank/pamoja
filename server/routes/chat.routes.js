import express from "express";
import {
  askChatGpt,
  clearHistory,
  getChatHistory,
} from "../controllers/chat.controller.js";
import { optionalAuth, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(optionalAuth, askChatGpt)
  .get(optionalAuth, getChatHistory)
  .delete(protect, clearHistory);

export default router;
