import express from "express";
import {
  createLearningMaterial,
  getLearningMaterials,
  getLearningMaterial,
  updateLearningMaterial,
  deleteLearningMaterial,
} from "../controllers/learningMaterial.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

// Public routes
router.get("/", getLearningMaterials);
router.get("/:id", getLearningMaterial);

// Protected routes (require authentication)
router.use(protect, isAdmin);
router.post("/", createLearningMaterial);
router.patch("/:id", updateLearningMaterial);
router.delete("/:id", deleteLearningMaterial);

export default router;
