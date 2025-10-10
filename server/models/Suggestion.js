import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["FEATURE REQUEST", "IMPROVEMENT", "BUG REPORT"],
      required: [true, "Type of suggestion is required"],
    },
    suggestion: {
      type: String,
      required: [true, "Suggestion string is required"],
    },
  },
  { timestamps: true }
);

const Suggestion = mongoose.model("Suggestion", suggestionSchema);
export default Suggestion;
