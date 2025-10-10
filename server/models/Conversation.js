import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    // session ID for anonymous users
    sessionId: {
      type: String,
      required: false,
      index: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant", "system"],
          required: [true, "user role is required"],
        },
        content: {
          type: String,
          required: [true, "message content is required"],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    encryptedHistory: {
      type: String,
      required: true,
    },
    iv: {
      type: String,
      required: true,
    },
    authTag: {
      type: String,
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
    isWhatsApp: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ sessionId: 1, createdAt: -1 });
// Add index for WhatsApp sessions
conversationSchema.index({ isWhatsApp: 1, sessionId: 1, createdAt: -1 });

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
