import { AppError, catchAsync } from "../utils/index.js";
import { configureOpenAI } from "../utils/openai.js";
import { askChatGpt } from "./chat.controller.js";

// WhatsApp verification token (should match what you set in Facebook Developer Console)
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// Create a session ID from phone number (with a prefix to distinguish from web sessions)
const createWhatsAppSessionId = (phoneNumber) => {
  return `wa_${phoneNumber.replace("+", "")}`;
};

// Handle webhook verification from Facebook
export const verifyWebhook = (req, res) => {
  try {
    console.log("Received webhook verification request");
    console.log("Environment VERIFY_TOKEN:", VERIFY_TOKEN);
    console.log("Query parameters:", req.query);

    // Parse params from the webhook verification request
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    console.log({
      receivedMode: mode,
      receivedToken: token,
      receivedChallenge: challenge,
      expectedToken: VERIFY_TOKEN,
      tokenMatch: token === VERIFY_TOKEN,
    });

    // Check if a token and mode were sent
    if (!mode || !token) {
      console.log("Missing mode or token");
      return res.status(403).json({
        error: "Missing parameters",
        received: { mode, token },
      });
    }

    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED - Sending challenge:", challenge);
      return res.status(200).send(challenge);
    }

    // Responds with '403 Forbidden' if verify tokens do not match
    console.log("Verification failed - Token mismatch");
    return res.status(403).json({
      error: "Verification failed",
      expected: VERIFY_TOKEN,
      received: token,
    });
  } catch (error) {
    console.error("Webhook verification error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

// Handle incoming WhatsApp messages
export const handleWhatsAppMessage = catchAsync(async (req, res, next) => {
  try {
    // Verify this is a WhatsApp message event
    if (req.body.object !== "whatsapp_business_account")
      return res.sendStatus(400);

    const changes = req.body.entry?.[0]?.changes?.[0];
    if (!changes || changes.field !== "messages") {
      console.log("No message changes found");
      return res.sendStatus(400);
    }

    const message = changes.value.messages?.[0];
    if (!message) {
      console.log("No message found in the webhook");
      return res.sendStatus(400);
    }

    const from = message.from;
    const messageText = message.text?.body;

    if (!messageText) return res.sendStatus(400);

    // session ID from the WhatsApp number
    const sessionId = createWhatsAppSessionId(from);

    // Prepare the request for the chat controller
    req.body = {
      question: messageText,
      sessionId: sessionId, //  sessionId to maintain conversation history
      isWhatsApp: true, // a flag to identify WhatsApp sessions
    };
    req.user = null;

    await askChatGpt(req, res);

    const whatsappResponse = await sendWhatsAppMessage(
      from,
      res.assistantResponse
    );
    console.log("WhatsApp API response:", whatsappResponse);

    res.status(200).json({
      success: true,
      message: "Message processed successfully",
      sessionId: sessionId,
    });
  } catch (error) {
    console.error("Error processing WhatsApp message:", error);
    res.sendStatus(200);
  }
});

// Send message using WhatsApp Cloud API
export const sendWhatsAppMessage = async (to, message) => {
  try {
    console.log("Sending WhatsApp message:", {
      to,
      message,
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    });

    const response = await fetch(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to,
          type: "text",
          text: {
            body: message,
            preview_url: false,
          },
        }),
      }
    );

    const responseData = await response.json();
    console.log("WhatsApp API response data:", responseData);

    if (!response.ok) {
      throw new Error(
        `WhatsApp API error: ${response.status} - ${JSON.stringify(
          responseData
        )}`
      );
    }

    return responseData;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    throw new AppError(
      `Failed to send WhatsApp message: ${error.message}`,
      500
    );
  }
};

// Get WhatsApp connection status
export const getWhatsAppStatus = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      connected: true,
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    },
  });
});
