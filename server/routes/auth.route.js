import express from "express";
import {
  login,
  register,
  getMe,
  generateAnonymousSession,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { generateToken } from "../middlewares/generateToken.js";
import { registerRequestBodyValidator } from "../middlewares/validators/register.request.validator.js";
import { loginRequestBodyValidator } from "../middlewares/validators/login.request.validator.js";

const router = express.Router();

router.post("/register", registerRequestBodyValidator, register, generateToken);
router.post("/login", loginRequestBodyValidator, login, generateToken);
router.post("/anonymous-session", generateAnonymousSession);

router.get("/me", protect, getMe);

export default router;
