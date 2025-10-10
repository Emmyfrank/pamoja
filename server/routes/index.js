import express from "express";

import authRoutes from "./auth.route.js";
import chatRoutes from "./chat.routes.js";
import suggestionsRoutes from "./suggestion.route.js";
import communityRoutes from "./community.route.js";
import whatsappRoutes from "./whatsapp.route.js";
import moderationRoutes from "./moderation.route.js";
import adminRoutes from "./admin.route.js";
import learningMaterialRoutes from "./learningMaterial.routes.js";
import testimonialsRoutes from "./testimonial.route.js";

import { requestLogger } from "../middlewares/index.js";

const router = express.Router();

router.use(requestLogger);
router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/suggestions", suggestionsRoutes);
router.use("/testimonials", testimonialsRoutes);
router.use("/community", communityRoutes);
router.use("/whatsapp", whatsappRoutes);
router.use("/moderation", moderationRoutes);
router.use("/admin", adminRoutes);
router.use("/learning-materials", learningMaterialRoutes);

export default router;
