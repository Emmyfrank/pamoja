import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
  getSiteStats,
  getAllUsers,
  updateUserRole,
  getLearningMaterials,
  createLearningMaterial,
  updateLearningMaterial,
  deleteLearningMaterial,
  getUserGrowthAnalytics,
  getCommunityEngagementAnalytics,
  getConversationAnalytics,
  getLearningMaterialsAnalytics,
  getDashboardAnalytics,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(protect);
router.use(isAdmin);

router.get("/stats", getSiteStats);
router.get("/dashboard", getDashboardAnalytics);

router.get("/users", getAllUsers);
router.patch("/users/:userId/role", updateUserRole);

router.get("/analytics/user-growth", getUserGrowthAnalytics);
router.get("/analytics/community-engagement", getCommunityEngagementAnalytics);
router.get("/analytics/conversations", getConversationAnalytics);
router.get("/analytics/learning-materials", getLearningMaterialsAnalytics);

router.get("/materials", getLearningMaterials);
router.post("/materials", createLearningMaterial);
router.patch("/materials/:materialId", updateLearningMaterial);
router.delete("/materials/:materialId", deleteLearningMaterial);

export default router;
