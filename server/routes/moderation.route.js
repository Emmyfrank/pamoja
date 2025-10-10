import express from "express";
import { moderateContent } from "../controllers/moderation.controller.js";

const router = express.Router();

router.post("/validate", moderateContent);

export default router;
