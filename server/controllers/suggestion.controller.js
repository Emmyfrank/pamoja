import { validateRequestBody } from "../middlewares/validators/index.js";
import Suggestion from "../models/Suggestion.js";
import { sendSuggestionEmail } from "../utils/emailHelpers.js";
import { catchAsync } from "../utils/index.js";

/**
 * @swagger
 * /suggestions:
 *   post:
 *     summary: Submit a suggestion
 *     tags: [Suggestions]
 *     description: Submit user feedback, feature requests, or bug reports
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - suggestion
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [FEATURE REQUEST, IMPROVEMENT, BUG REPORT]
 *                 description: Type of suggestion
 *                 example: "FEATURE REQUEST"
 *               suggestion:
 *                 type: string
 *                 description: Suggestion text
 *                 example: "Add a dark mode feature to the app"
 *     responses:
 *       201:
 *         description: Suggestion submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     newSuggestion:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         type:
 *                           type: string
 *                         suggestion:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
export const sendSuggestion = catchAsync(async (req, res, next) => {
  validateRequestBody(req, res);
  const { type, suggestion } = req.body;
  const newSuggestion = await Suggestion.create({ type, suggestion });
  await sendSuggestionEmail(type, suggestion);
  res.status(201).json({ success: true, data: { newSuggestion } });
});
