import express from "express";
import { sendSuggestion } from "../controllers/suggestion.controller.js";
import { suggestionsRequestBodyValidator } from "../middlewares/validators/suggestions.request.validator.js";

const router = express.Router();

router.route("/").post(suggestionsRequestBodyValidator, sendSuggestion);

export default router;
