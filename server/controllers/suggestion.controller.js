import { validateRequestBody } from "../middlewares/validators/index.js";
import Suggestion from "../models/Suggestion.js";
import { sendSuggestionEmail } from "../utils/emailHelpers.js";
import { catchAsync } from "../utils/index.js";

export const sendSuggestion = catchAsync(async (req, res, next) => {
  validateRequestBody(req, res);
  const { type, suggestion } = req.body;
  const newSuggestion = await Suggestion.create({ type, suggestion });
  await sendSuggestionEmail(type, suggestion);
  res.status(201).json({ success: true, data: { newSuggestion } });
});
