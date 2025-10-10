import { catchAsync, logger } from "../utils/index.js";
import { configureOpenAI } from "../utils/openai.js";
import { encrypt, decrypt } from "../utils/encryption.js";
import Conversation from "../models/Conversation.js";

export const askChatGpt = catchAsync(async (req, res, next) => {
  const { question, isWhatsApp } = req.body;
  const openai = configureOpenAI();

  const userId = req.user ? req.user._id : null;
  const sessionId = req.body.sessionId || null;

  try {
    let conversation;
    if (userId) {
      conversation = await Conversation.findOne({ userId })
        .sort({ createdAt: -1 })
        .limit(1);
    } else if (sessionId) {
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
        messages = [...messages, ...historyMessages];
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

// Endpoint to clear conversation history
export const clearHistory = catchAsync(async (req, res, next) => {
  await Conversation.deleteMany({ userId: req.user._id });
  res.status(200).json({
    success: true,
    message: "Conversation history cleared successfully",
  });
});

export const getChatHistory = catchAsync(async (req, res, next) => {
  const messages = await Conversation.find({ userId: req.user._id }).select(
    "messages"
  );
  res.status(200).json({ success: true, data: { messages } });
});
