import mongoose from "mongoose";

const communityMessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },
    username: {
      type: String,
      default: "Anonymous",
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

const CommunityMessage = mongoose.model(
  "CommunityMessage",
  communityMessageSchema
);
export default CommunityMessage;
