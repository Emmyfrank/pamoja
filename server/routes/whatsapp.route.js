import express from "express";
import {
  handleWhatsAppMessage,
  verifyWebhook,
  getWhatsAppStatus,
} from "../controllers/whatsapp.controller.js";

const router = express.Router();

// WhatsApp webhook verification endpoint (must be GET)
router.get("/webhook", verifyWebhook);

// WhatsApp webhook for receiving messages (must be POST)
router.post("/webhook", express.json(), handleWhatsAppMessage);

// Status endpoint
router.get("/status", getWhatsAppStatus);

export default router;
