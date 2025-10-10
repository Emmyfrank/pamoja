import { validateRequestBody } from "../middlewares/validators/index.js";
import User from "../models/User.js";
import { AppError, catchAsync } from "../utils/index.js";
import { v4 as uuidv4 } from "uuid";
import { generateRandomName } from "../utils/nameGenerator.js";

export const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  validateRequestBody(req, res);

  const user = await User.findOne({ username }).select("+password");
  if (!user) return next(AppError("Invalid credentials"));

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) return next(AppError("Invalid credentials"));

  user.password = undefined;
  req.user = user;
  next();
});

export const register = catchAsync(async (req, res, next) => {
  const { username, password, isAnonymous } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser)
    return next(AppError("User with this username already exists"));

  const user = await User.create({
    username,
    password,
    isAnonymous: isAnonymous || false,
  });

  user.password = undefined;

  req.user = user;
  next();
});

export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

// Generate a session ID for anonymous users
export const generateAnonymousSession = catchAsync(async (req, res, next) => {
  try {
    const sessionId = uuidv4();
    const displayName = generateRandomName();

    // Store session in req.session
    req.session.user = {
      sessionId,
      displayName,
      isAnonymous: true,
    };

    res.status(200).json({
      success: true,
      data: {
        sessionId,
        displayName,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error generating anonymous session",
    });
  }
});
