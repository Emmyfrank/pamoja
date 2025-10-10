import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Answer content is required"],
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
    votes: {
      type: Number,
      default: 0,
    },
    voters: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
  },
  { timestamps: true }
);

const communityQuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Question title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Question content is required"],
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
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    answers: [answerSchema],
    votes: {
      type: Number,
      default: 0,
    },
    voters: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
  },
  { timestamps: true }
);

// Add indexes for better query performance
communityQuestionSchema.index({ createdAt: -1 });
communityQuestionSchema.index({ tags: 1 });
communityQuestionSchema.index({ votes: -1 });

const CommunityQuestion = mongoose.model(
  "CommunityQuestion",
  communityQuestionSchema
);

export default CommunityQuestion;
