import mongoose from "mongoose";

const learningMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "MATERNAL_HEALTH",
        "SAFE_ABORTION",
        "YOUTH_HEALTH",
        "GBV_SUPPORT",
        "CONTRACEPTION",
        "SEXUAL_HEALTH",
        "REPRODUCTIVE_HEALTH",
        "MENTAL_HEALTH",
        "RELATIONSHIPS",
      ],
    },
    icon: {
      type: String,
      enum: ["Heart", "Shield", "Users", "Book", "BookOpen"],
      default: "Book",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    url: { type: String },
    readTime: {
      type: String,
      default: "5min",
    },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "DRAFT",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LearningMaterial = mongoose.model(
  "LearningMaterial",
  learningMaterialSchema
);

export default LearningMaterial;
