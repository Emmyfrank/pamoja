import { validateRequestBody } from "../middlewares/validators/index.js";
import User from "../models/User.js";
import { AppError, catchAsync } from "../utils/index.js";
import { v4 as uuidv4 } from "uuid";
import { generateRandomName } from "../utils/nameGenerator.js";

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     description: Authenticate user with username and password. Returns JWT token and user data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       description: JWT authentication token
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Invalid credentials
 */
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

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Create a new user account. Can be anonymous or registered.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: "securePassword123"
 *               isAnonymous:
 *                 type: boolean
 *                 description: Whether the user is anonymous
 *                 default: false
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       description: JWT authentication token
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
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

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     description: Returns the current authenticated user's information
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

/**
 * @swagger
 * /auth/anonymous-session:
 *   post:
 *     summary: Generate anonymous session
 *     tags: [Authentication]
 *     description: Generate a session ID and display name for anonymous users
 *     responses:
 *       200:
 *         description: Anonymous session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     sessionId:
 *                       type: string
 *                       description: Unique session identifier
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     displayName:
 *                       type: string
 *                       description: Generated display name for anonymous user
 *                       example: "AnonymousUser123"
 *       500:
 *         description: Internal server error
 */
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
