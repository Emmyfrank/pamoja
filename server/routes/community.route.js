import express from "express";
import {
  createQuestion,
  getQuestions,
  getQuestion,
  addAnswer,
  voteQuestion,
  questionExists,
} from "../controllers/community.controller.js";

const router = express.Router();

router.route("/questions").get(getQuestions).post(createQuestion);
router.route("/questions/:id").get(questionExists, getQuestion);
router.route("/questions/:id/answers").post(questionExists, addAnswer);
router.route("/questions/:id/vote").post(questionExists, voteQuestion);

export default router;
