import LearningMaterial from "../models/LearningMaterial.js";
import { catchAsync } from "../utils/catchAsync.js";

// Create a new learning material
export const createLearningMaterial = catchAsync(async (req, res) => {
  const {
    title,
    description,
    category,
    icon,
    articles,
    featured,
    status,
    url,
  } = req.body;

  const learningMaterial = await LearningMaterial.create({
    title,
    description,
    category,
    icon,
    articles,
    featured,
    status,
    url,
    author: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: learningMaterial,
  });
});

// Get all learning materials
export const getLearningMaterials = catchAsync(async (req, res) => {
  const { category, status } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (status) filter.status = status;

  const learningMaterials = await LearningMaterial.find(filter)
    .sort({ createdAt: -1 })
    .populate("author", "name email");

  res.status(200).json({
    status: "success",
    results: learningMaterials.length,
    data: learningMaterials,
  });
});

// Get a single learning material
export const getLearningMaterial = catchAsync(async (req, res) => {
  const learningMaterial = await LearningMaterial.findById(
    req.params.id
  ).populate("author", "name email");

  if (!learningMaterial) {
    return res.status(404).json({
      status: "error",
      message: "Learning material not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: learningMaterial,
  });
});

// Update a learning material
export const updateLearningMaterial = catchAsync(async (req, res) => {
  const { title, description, category, icon, articles, featured, status } =
    req.body;

  const learningMaterial = await LearningMaterial.findById(req.params.id);

  if (!learningMaterial) {
    return res.status(404).json({
      status: "error",
      message: "Learning material not found",
    });
  }

  // Check if user is author or admin
  if (
    learningMaterial.author.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      status: "error",
      message: "You are not authorized to update this learning material",
    });
  }

  const updatedLearningMaterial = await LearningMaterial.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      category,
      icon,
      articles,
      featured,
      status,
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate("author", "name email");

  res.status(200).json({
    status: "success",
    data: updatedLearningMaterial,
  });
});

// Delete a learning material
export const deleteLearningMaterial = catchAsync(async (req, res) => {
  const learningMaterial = await LearningMaterial.findById(req.params.id);

  if (!learningMaterial) {
    return res.status(404).json({
      status: "error",
      message: "Learning material not found",
    });
  }

  // Check if user is author or admin
  if (
    learningMaterial.author.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      status: "error",
      message: "You are not authorized to delete this learning material",
    });
  }

  await learningMaterial.deleteOne();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
