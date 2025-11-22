import { catchAsync, logger } from "../utils/index.js";
import { configureOpenAI } from "../utils/openai.js";
import { encrypt, decrypt } from "../utils/encryption.js";
import Conversation from "../models/Conversation.js";

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Send a message to the chatbot
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     description: Send a question to the AI chatbot. Maintains conversation context using userId or sessionId.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 description: User's question or message
 *                 example: "What are the symptoms of pregnancy?"
 *               sessionId:
 *                 type: string
 *                 description: Session ID for anonymous users (optional for authenticated users)
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               isWhatsApp:
 *                 type: boolean
 *                 description: Whether the request is from WhatsApp
 *                 default: false
 *     responses:
 *       200:
 *         description: Chat response received successfully
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
 *                     results:
 *                       type: string
 *                       description: AI assistant's response
 *                       example: "Pregnancy symptoms can include missed period, nausea, fatigue..."
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         description: Internal server error
 */
export const askChatGpt = catchAsync(async (req, res, next) => {
  const { question, isWhatsApp } = req.body;
  const openai = configureOpenAI();

  const userId = req.user ? req.user._id : null;
  const sessionId = req.body.sessionId || null;

  try {
    let conversation;
    // Check for conversation by userId first (for authenticated users)
    if (userId) {
      conversation = await Conversation.findOne({ userId })
        .sort({ createdAt: -1 })
        .limit(1);
    }
    // If no conversation found by userId, try sessionId (for continuity)
    if (!conversation && sessionId) {
      conversation = await Conversation.findOne({ sessionId })
        .sort({ createdAt: -1 })
        .limit(1);
    }

    let messages = [
      {
        role: "system",
        content: isWhatsApp
          ? "You are Pamoja AI, a helpful WhatsApp-based health assistant that specializes in SRH Health and personal health related issues. Keep responses concise and clear as this is WhatsApp. If a question is unrelated, politely say you're only trained to answer health questions. You can respond in the same language as the user's question. Avoid using emojis or special formatting that might not display well in WhatsApp."
          : "You are a helpful assistant called Pamoja AI that only answers questions about SRH Health and personal health related issues. If a question is unrelated to that or the previous conversations, politely say you're only trained to answer questions about SRH Health and personal health related issues, and sometimes add also that you are still under development they have to be clear with their questions. You can respond in the same language as the user's question (e.g., if they ask in French, respond in French).",
      },
    ];

    // If there's an existing conversation, decrypt and add it to messages
    if (conversation) {
      try {
        const decryptedHistory = decrypt(
          conversation.encryptedHistory,
          conversation.iv,
          conversation.authTag
        );
        const historyMessages = JSON.parse(decryptedHistory);
        // Filter out system messages from history (keep only user and assistant messages)
        const conversationMessages = historyMessages.filter(
          (msg) => msg.role !== "system"
        );
        messages = [...messages, ...conversationMessages];
      } catch (error) {
        logger.error(
          "Error decrypting conversation history, starting a new conversation..."
        );
      }
    }

    // Add the current question
    messages.push({ role: "user", content: question });

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: messages,
      // Add temperature and max tokens for WhatsApp to ensure concise responses
      ...(isWhatsApp && {
        temperature: 0.7,
        max_tokens: 200, // Limit response length for WhatsApp
      }),
    });

    const assistantResponse = completion.choices[0].message.content.trim();

    // Add the assistant's response to messages
    messages.push({ role: "assistant", content: assistantResponse });

    // Encrypt the updated conversation history
    let encryptedData, iv, authTag;
    try {
      const encrypted = encrypt(JSON.stringify(messages));
      encryptedData = encrypted.encryptedData;
      iv = encrypted.iv;
      authTag = encrypted.authTag;
    } catch (error) {
      logger.error("Encryption error:", error);
      encryptedData = JSON.stringify(messages);
      iv = "fallback-iv";
      authTag = "fallback-auth-tag";
    }

    // save or update the conversation
    if (conversation) {
      conversation.encryptedHistory = encryptedData;
      conversation.iv = iv;
      conversation.authTag = authTag;
      // Update userId if user authenticated during the conversation
      if (userId && !conversation.userId) {
        conversation.userId = userId;
        conversation.isAnonymous = false;
      }
      // Update sessionId if it's a new session
      if (sessionId && !conversation.sessionId) {
        conversation.sessionId = sessionId;
      }
      conversation.messages.push(
        { role: "user", content: question },
        { role: "assistant", content: assistantResponse }
      );
      await conversation.save();
    } else {
      await Conversation.create({
        userId,
        sessionId,
        encryptedHistory: encryptedData,
        iv,
        authTag,
        messages: [
          { role: "user", content: question },
          { role: "assistant", content: assistantResponse },
        ],
        isAnonymous: !userId,
        isWhatsApp: isWhatsApp || false,
      });
    }

    res.assistantResponse = assistantResponse;

    res.status(200).json({
      success: true,
      data: { results: assistantResponse },
    });
  } catch (error) {
    console.log(error);

    logger.error("Chat error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get response from AI",
      details: error.message,
    });
  }
});

/**
 * @swagger
 * /chat:
 *   delete:
 *     summary: Clear conversation history
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     description: Delete all conversation history for the authenticated user
 *     responses:
 *       200:
 *         description: Conversation history cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Conversation history cleared successfully"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
// Endpoint to clear conversation history
export const clearHistory = catchAsync(async (req, res, next) => {
  await Conversation.deleteMany({ userId: req.user._id });
  res.status(200).json({
    success: true,
    message: "Conversation history cleared successfully",
  });
});

/**
 * @swagger
 * /chat:
 *   get:
 *     summary: Get conversation history
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve conversation history for the user (authenticated or anonymous via sessionId)
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *         description: Session ID for anonymous users (optional)
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Conversation history retrieved successfully
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
 *                     messages:
 *                       type: array
 *                       description: Array of conversations with message history
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           messages:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 role:
 *                                   type: string
 *                                   enum: [user, assistant, system]
 *                                 content:
 *                                   type: string
 *                                 timestamp:
 *                                   type: string
 *                                   format: date-time
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
export const getChatHistory = catchAsync(async (req, res, next) => {
  const userId = req.user ? req.user._id : null;
  const sessionId = req.query.sessionId || null;
  
  let conversations;
  if (userId) {
    // For authenticated users, get conversations by userId or sessionId
    conversations = await Conversation.find({
      $or: [{ userId }, { sessionId }],
    }).select("messages").sort({ createdAt: -1 });
  } else if (sessionId) {
    // For anonymous users, get conversations by sessionId
    conversations = await Conversation.find({ sessionId })
      .select("messages")
      .sort({ createdAt: -1 });
  } else {
    return res.status(200).json({ success: true, data: { messages: [] } });
  }

  res.status(200).json({ success: true, data: { messages: conversations } });
});
