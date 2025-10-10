import { AppError, catchAsync } from "../utils/index.js";
import { configureOpenAI } from "../utils/openai.js";

export const moderateContent = catchAsync(async (req, res, next) => {
  const { content, questionContext, previousMessages } = req.body;

  if (!content) return next(AppError("Content is required"));

  const openai = configureOpenAI();

  try {
    const contextPrompt = questionContext
      ? `\nOriginal Question: "${questionContext}"`
      : "";

    const previousMessagesPrompt = previousMessages?.length
      ? `\nPrevious Messages:\n${previousMessages
          .map((msg, i) => `${i + 1}. ${msg}`)
          .join("\n")}`
      : "";

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a content moderation AI. Your task is to analyze the given content and determine if it's appropriate for a health-focused community platform. 

Consider the following criteria:
1. No hate speech, discrimination, or offensive content
2. No explicit sexual content or inappropriate medical terminology
3. No promotion of harmful practices or dangerous medical advice
4. No spam or promotional content
5. Must be related to health, wellness, or medical topics
6. Must maintain a respectful and supportive tone
7. If this is a response to a question, it must be relevant to the original question and ongoing discussion

Context Information:${contextPrompt}${previousMessagesPrompt}

Respond with a JSON object containing:
- isValid: boolean
- message: string (explanation if content is rejected)
- category: string (health, spam, inappropriate, offensive, unrelated, or valid)
- relevanceScore: number (0-1, indicating how relevant the response is to the question/discussion)`,
        },
        {
          role: "user",
          content: `Please analyze this content: "${content}"`,
        },
      ],
      temperature: 0,
      max_tokens: 200,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return next(AppError("Failed to moderate content"));
  }
});
