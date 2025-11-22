import { catchAsync, AppError } from "../utils/index.js";
import User from "../models/User.js";
import LearningMaterial from "../models/LearningMaterial.js";
import CommunityMessage from "../models/CommunityMessage.js";
import CommunityQuestion from "../models/CommunityQuestion.js";
import Conversation from "../models/Conversation.js";
import Suggestion from "../models/Suggestion.js";
import Testimonial from "../models/Testimonial.js";

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get comprehensive site statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Get overall site statistics including users, materials, messages, questions, etc. (Admin only)
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
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
 *                     totalUsers:
 *                       type: number
 *                       description: Total number of users
 *                     totalMaterials:
 *                       type: number
 *                       description: Total number of learning materials
 *                     totalMessages:
 *                       type: number
 *                       description: Total number of community messages
 *                     totalQuestions:
 *                       type: number
 *                       description: Total number of community questions
 *                     totalConversations:
 *                       type: number
 *                       description: Total number of conversations
 *                     totalSuggestions:
 *                       type: number
 *                       description: Total number of suggestions
 *                     totalTestimonials:
 *                       type: number
 *                       description: Total number of testimonials
 *                     anonymousUsers:
 *                       type: number
 *                       description: Number of anonymous users
 *                     registeredUsers:
 *                       type: number
 *                       description: Number of registered users
 *                     whatsappConversations:
 *                       type: number
 *                       description: Number of WhatsApp conversations
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Admin access required
 */
// Get comprehensive site statistics
export const getSiteStats = catchAsync(async (req, res) => {
  const [
    totalUsers,
    totalMaterials,
    totalMessages,
    totalQuestions,
    totalConversations,
    totalSuggestions,
    totalTestimonials,
    anonymousUsers,
    registeredUsers,
    whatsappConversations,
  ] = await Promise.all([
    User.countDocuments(),
    LearningMaterial.countDocuments(),
    CommunityMessage.countDocuments(),
    CommunityQuestion.countDocuments(),
    Conversation.countDocuments(),
    Suggestion.countDocuments(),
    Testimonial.countDocuments(),
    User.countDocuments({ isAnonymous: true }),
    User.countDocuments({ isAnonymous: false }),
    Conversation.countDocuments({ isWhatsApp: true }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalMaterials,
      totalMessages,
      totalQuestions,
      totalConversations,
      totalSuggestions,
      totalTestimonials,
      anonymousUsers,
      registeredUsers,
      whatsappConversations,
    },
  });
});

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users with pagination
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve users in the system with pagination support (Admin only)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (starts from 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           description: Current page number
 *                         limit:
 *                           type: integer
 *                           description: Items per page
 *                         total:
 *                           type: integer
 *                           description: Total number of users
 *                         totalPages:
 *                           type: integer
 *                           description: Total number of pages
 *                         hasNextPage:
 *                           type: boolean
 *                           description: Whether there is a next page
 *                         hasPrevPage:
 *                           type: boolean
 *                           description: Whether there is a previous page
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Admin access required
 */
// Get all users with pagination
export const getAllUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const total = await User.countDocuments();
  const totalPages = Math.ceil(total / limit);

  const users = await User.find()
    .select("-password -personalInfoHash")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: { 
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    },
  });
});

// Update user role
export const updateUserRole = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!["USER", "ADMIN"].includes(role)) {
    return next(AppError("Invalid role specified"));
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select("-password -personalInfoHash");

  if (!user) {
    return next(AppError("User not found"));
  }

  res.status(200).json({
    success: true,
    data: { user },
  });
});

// Get all learning materials
export const getLearningMaterials = catchAsync(async (req, res) => {
  const materials = await LearningMaterial.find()
    .populate("author", "username")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    data: { materials },
  });
});

/**
 * @swagger
 * /admin/suggestions:
 *   get:
 *     summary: Get all suggestions
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all user suggestions (Admin only)
 *     responses:
 *       200:
 *         description: Suggestions retrieved successfully
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
 *                     suggestions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           type:
 *                             type: string
 *                             enum: [FEATURE REQUEST, IMPROVEMENT, BUG REPORT]
 *                           suggestion:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Admin access required
 */
// Get all suggestions
export const getAllSuggestions = catchAsync(async (req, res) => {
  const suggestions = await Suggestion.find().sort("-createdAt");

  res.status(200).json({
    success: true,
    data: { suggestions },
  });
});

// Create learning material
export const createLearningMaterial = catchAsync(async (req, res) => {
  const { title, content, category, tags, status } = req.body;

  const material = await LearningMaterial.create({
    title,
    content,
    category,
    tags,
    status,
    author: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: { material },
  });
});

// Update learning material
export const updateLearningMaterial = catchAsync(async (req, res) => {
  const { materialId } = req.params;
  const { title, content, category, tags, status } = req.body;

  const material = await LearningMaterial.findByIdAndUpdate(
    materialId,
    { title, content, category, tags, status },
    { new: true }
  ).populate("author", "username");

  if (!material) {
    return next(AppError("Learning material not found"));
  }

  res.status(200).json({
    success: true,
    data: { material },
  });
});

// Delete learning material
export const deleteLearningMaterial = catchAsync(async (req, res) => {
  const { materialId } = req.params;

  const material = await LearningMaterial.findByIdAndDelete(materialId);

  if (!material) {
    return next(AppError("Learning material not found"));
  }

  res.status(200).json({
    success: true,
    message: "Learning material deleted successfully",
  });
});

// Get user growth analytics
export const getUserGrowthAnalytics = catchAsync(async (req, res) => {
  const { period = "1y" } = req.query;

  let startDate;
  const now = new Date();
  const isYearly = period === "1y";

  switch (period) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  }

  // Group by month for yearly, by day for shorter periods
  const groupId = isYearly
    ? {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      }
    : {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };

  const sortId = isYearly
    ? { "_id.year": 1, "_id.month": 1 }
    : { "_id.year": 1, "_id.month": 1, "_id.day": 1 };

  // Get user registrations
  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: groupId,
        count: { $sum: 1 },
        anonymous: {
          $sum: { $cond: [{ $eq: ["$isAnonymous", true] }, 1, 0] },
        },
        registered: {
          $sum: { $cond: [{ $eq: ["$isAnonymous", false] }, 1, 0] },
        },
      },
    },
    {
      $sort: sortId,
    },
  ]);

  // Get total users over time
  const totalUsersOverTime = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: groupId,
        cumulative: { $sum: 1 },
      },
    },
    {
      $sort: sortId,
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      userGrowth,
      totalUsersOverTime,
      period,
    },
  });
});

// Get community engagement analytics
export const getCommunityEngagementAnalytics = catchAsync(async (req, res) => {
  const { period = "1y" } = req.query;

  let startDate;
  const now = new Date();
  const isYearly = period === "1y";

  switch (period) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  }

  // Group by month for yearly, by day for shorter periods
  const groupId = isYearly
    ? {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      }
    : {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };

  const sortId = isYearly
    ? { "_id.year": 1, "_id.month": 1 }
    : { "_id.year": 1, "_id.month": 1, "_id.day": 1 };

  // Messages over time
  const messageEngagement = await CommunityMessage.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: groupId,
        count: { $sum: 1 },
        anonymous: {
          $sum: { $cond: [{ $eq: ["$isAnonymous", true] }, 1, 0] },
        },
        registered: {
          $sum: { $cond: [{ $eq: ["$isAnonymous", false] }, 1, 0] },
        },
      },
    },
    {
      $sort: sortId,
    },
  ]);

  // Questions over time
  const questionEngagement = await CommunityQuestion.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: groupId,
        count: { $sum: 1 },
        totalAnswers: { $sum: { $size: "$answers" } },
        totalVotes: { $sum: "$votes" },
      },
    },
    {
      $sort: sortId,
    },
  ]);

  // Top tags
  const topTags = await CommunityQuestion.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $unwind: "$tags",
    },
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 },
        totalVotes: { $sum: "$votes" },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 10,
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      messageEngagement,
      questionEngagement,
      topTags,
      period,
    },
  });
});

// Get conversation analytics
export const getConversationAnalytics = catchAsync(async (req, res) => {
  const { period = "1y" } = req.query;

  let startDate;
  const now = new Date();
  const isYearly = period === "1y";

  switch (period) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  }

  // Group by month for yearly, by day for shorter periods
  const groupId = isYearly
    ? {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      }
    : {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };

  const sortId = isYearly
    ? { "_id.year": 1, "_id.month": 1 }
    : { "_id.year": 1, "_id.month": 1, "_id.day": 1 };

  // Conversation trends
  const conversationTrends = await Conversation.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: groupId,
        count: { $sum: 1 },
        totalMessages: { $sum: { $size: "$messages" } },
        whatsapp: {
          $sum: { $cond: [{ $eq: ["$isWhatsApp", true] }, 1, 0] },
        },
        web: {
          $sum: { $cond: [{ $eq: ["$isWhatsApp", false] }, 1, 0] },
        },
        anonymous: {
          $sum: { $cond: [{ $eq: ["$isAnonymous", true] }, 1, 0] },
        },
        registered: {
          $sum: { $cond: [{ $eq: ["$isAnonymous", false] }, 1, 0] },
        },
      },
    },
    {
      $sort: sortId,
    },
  ]);

  // Average messages per conversation
  const avgMessagesPerConversation = await Conversation.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: null,
        avgMessages: { $avg: { $size: "$messages" } },
        totalConversations: { $sum: 1 },
        totalMessages: { $sum: { $size: "$messages" } },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      conversationTrends,
      avgMessagesPerConversation: avgMessagesPerConversation[0] || {
        avgMessages: 0,
        totalConversations: 0,
        totalMessages: 0,
      },
      period,
    },
  });
});

// Get learning materials analytics
export const getLearningMaterialsAnalytics = catchAsync(async (req, res) => {
  const { period = "1y" } = req.query;

  let startDate;
  const now = new Date();
  const isYearly = period === "1y";

  switch (period) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  }

  // Materials by category
  const materialsByCategory = await LearningMaterial.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        published: {
          $sum: { $cond: [{ $eq: ["$status", "PUBLISHED"] }, 1, 0] },
        },
        draft: {
          $sum: { $cond: [{ $eq: ["$status", "DRAFT"] }, 1, 0] },
        },
        featured: {
          $sum: { $cond: [{ $eq: ["$featured", true] }, 1, 0] },
        },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  // Group by month for yearly, by day for shorter periods
  const groupId = isYearly
    ? {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      }
    : {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };

  const sortId = isYearly
    ? { "_id.year": 1, "_id.month": 1 }
    : { "_id.year": 1, "_id.month": 1, "_id.day": 1 };

  // Materials over time
  const materialsOverTime = await LearningMaterial.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: groupId,
        count: { $sum: 1 },
        published: {
          $sum: { $cond: [{ $eq: ["$status", "PUBLISHED"] }, 1, 0] },
        },
        draft: {
          $sum: { $cond: [{ $eq: ["$status", "DRAFT"] }, 1, 0] },
        },
      },
    },
    {
      $sort: sortId,
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      materialsByCategory,
      materialsOverTime,
      period,
    },
  });
});

// Get comprehensive dashboard analytics
export const getDashboardAnalytics = catchAsync(async (req, res) => {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Recent activity (last 24h)
  const [
    newUsers24h,
    newMessages24h,
    newQuestions24h,
    newConversations24h,
    newMaterials24h,
  ] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: last24h } }),
    CommunityMessage.countDocuments({ createdAt: { $gte: last24h } }),
    CommunityQuestion.countDocuments({ createdAt: { $gte: last24h } }),
    Conversation.countDocuments({ createdAt: { $gte: last24h } }),
    LearningMaterial.countDocuments({ createdAt: { $gte: last24h } }),
  ]);

  // Weekly trends
  const [
    newUsers7d,
    newMessages7d,
    newQuestions7d,
    newConversations7d,
    newMaterials7d,
  ] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: last7d } }),
    CommunityMessage.countDocuments({ createdAt: { $gte: last7d } }),
    CommunityQuestion.countDocuments({ createdAt: { $gte: last7d } }),
    Conversation.countDocuments({ createdAt: { $gte: last7d } }),
    LearningMaterial.countDocuments({ createdAt: { $gte: last7d } }),
  ]);

  // Monthly trends
  const [
    newUsers30d,
    newMessages30d,
    newQuestions30d,
    newConversations30d,
    newMaterials30d,
  ] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: last30d } }),
    CommunityMessage.countDocuments({ createdAt: { $gte: last30d } }),
    CommunityQuestion.countDocuments({ createdAt: { $gte: last30d } }),
    Conversation.countDocuments({ createdAt: { $gte: last30d } }),
    LearningMaterial.countDocuments({ createdAt: { $gte: last30d } }),
  ]);

  // User engagement metrics
  const userEngagement = await User.aggregate([
    {
      $lookup: {
        from: "communitymessages",
        localField: "_id",
        foreignField: "userId",
        as: "messages",
      },
    },
    {
      $lookup: {
        from: "communityquestions",
        localField: "_id",
        foreignField: "userId",
        as: "questions",
      },
    },
    {
      $lookup: {
        from: "conversations",
        localField: "_id",
        foreignField: "userId",
        as: "conversations",
      },
    },
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $gt: [{ $size: "$messages" }, 0] },
                  { $gt: [{ $size: "$questions" }, 0] },
                  { $gt: [{ $size: "$conversations" }, 0] },
                ],
              },
              1,
              0,
            ],
          },
        },
        avgMessagesPerUser: { $avg: { $size: "$messages" } },
        avgQuestionsPerUser: { $avg: { $size: "$questions" } },
        avgConversationsPerUser: { $avg: { $size: "$conversations" } },
      },
    },
  ]);

  // Calculate growth percentages
  const userGrowthPercent = newUsers7d > 0 
    ? ((newUsers24h / newUsers7d) * 100).toFixed(1)
    : 0;
  const messageGrowthPercent = newMessages7d > 0
    ? ((newMessages24h / newMessages7d) * 100).toFixed(1)
    : 0;
  const questionGrowthPercent = newQuestions7d > 0
    ? ((newQuestions24h / newQuestions7d) * 100).toFixed(1)
    : 0;

  // Calculate engagement rates
  const totalUsers = await User.countDocuments();
  const activeUsers = userEngagement[0]?.activeUsers || 0;
  const engagementRate = totalUsers > 0
    ? ((activeUsers / totalUsers) * 100).toFixed(1)
    : 0;

  // Calculate answer rate
  const totalQuestions = await CommunityQuestion.countDocuments();
  const questionsWithAnswers = await CommunityQuestion.countDocuments({
    "answers.0": { $exists: true },
  });
  const answerRate = totalQuestions > 0
    ? ((questionsWithAnswers / totalQuestions) * 100).toFixed(1)
    : 0;

  // Calculate average response time (simplified - using question creation to first answer)
  const questionsWithAnswersData = await CommunityQuestion.find({
    "answers.0": { $exists: true },
  }).select("createdAt answers").limit(100);

  let totalResponseTime = 0;
  let responseCount = 0;
  questionsWithAnswersData.forEach((q) => {
    if (q.answers && q.answers.length > 0 && q.answers[0].createdAt) {
      const responseTime = q.answers[0].createdAt - q.createdAt;
      totalResponseTime += responseTime;
      responseCount++;
    }
  });
  const avgResponseTimeHours = responseCount > 0
    ? (totalResponseTime / responseCount / (1000 * 60 * 60)).toFixed(1)
    : 0;

  // Calculate platform distribution
  const totalConversations = await Conversation.countDocuments();
  const whatsappConversations = await Conversation.countDocuments({ isWhatsApp: true });
  const webConversations = totalConversations - whatsappConversations;
  const whatsappPercent = totalConversations > 0
    ? ((whatsappConversations / totalConversations) * 100).toFixed(1)
    : 0;
  const webPercent = totalConversations > 0
    ? ((webConversations / totalConversations) * 100).toFixed(1)
    : 0;

  // Calculate content metrics
  const totalMaterials = await LearningMaterial.countDocuments();
  const publishedMaterials = await LearningMaterial.countDocuments({ status: "PUBLISHED" });
  const publishRate = totalMaterials > 0
    ? ((publishedMaterials / totalMaterials) * 100).toFixed(1)
    : 0;

  res.status(200).json({
    success: true,
    data: {
      recentActivity: {
        last24h: {
          newUsers: newUsers24h,
          newMessages: newMessages24h,
          newQuestions: newQuestions24h,
          newConversations: newConversations24h,
          newMaterials: newMaterials24h,
        },
        last7d: {
          newUsers: newUsers7d,
          newMessages: newMessages7d,
          newQuestions: newQuestions7d,
          newConversations: newConversations7d,
          newMaterials: newMaterials7d,
        },
        last30d: {
          newUsers: newUsers30d,
          newMessages: newMessages30d,
          newQuestions: newQuestions30d,
          newConversations: newConversations30d,
          newMaterials: newMaterials30d,
        },
      },
      userEngagement: userEngagement[0] || {
        totalUsers: 0,
        activeUsers: 0,
        avgMessagesPerUser: 0,
        avgQuestionsPerUser: 0,
        avgConversationsPerUser: 0,
      },
      calculatedMetrics: {
        userGrowthPercent: parseFloat(userGrowthPercent),
        messageGrowthPercent: parseFloat(messageGrowthPercent),
        questionGrowthPercent: parseFloat(questionGrowthPercent),
        engagementRate: parseFloat(engagementRate),
        answerRate: parseFloat(answerRate),
        avgResponseTimeHours: parseFloat(avgResponseTimeHours),
        whatsappPercent: parseFloat(whatsappPercent),
        webPercent: parseFloat(webPercent),
        publishRate: parseFloat(publishRate),
        totalUsers,
        activeUsers,
        totalQuestions,
        questionsWithAnswers,
        totalConversations,
        whatsappConversations,
        webConversations,
        totalMaterials,
        publishedMaterials,
      },
    },
  });
});

// Get advanced statistical analytics
export const getAdvancedStatistics = catchAsync(async (req, res) => {
  const { period = "1y" } = req.query;
  
  let startDate;
  const now = new Date();
  
  switch (period) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  }

  // Hourly activity distribution
  const hourlyActivity = await CommunityMessage.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: { $hour: "$createdAt" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id": 1 },
    },
  ]);

  // Day of week activity
  const dayOfWeekActivity = await CommunityMessage.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id": 1 },
    },
  ]);

  // User retention cohorts
  const userCohorts = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  // Content category performance
  const categoryPerformance = await LearningMaterial.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: 1 },
        published: {
          $sum: { $cond: [{ $eq: ["$status", "PUBLISHED"] }, 1, 0] },
        },
        featured: {
          $sum: { $cond: [{ $eq: ["$featured", true] }, 1, 0] },
        },
      },
    },
    {
      $sort: { total: -1 },
    },
  ]);

  // Question answer distribution
  const answerDistribution = await CommunityQuestion.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $project: {
        answerCount: { $size: { $ifNull: ["$answers", []] } },
        votes: 1,
      },
    },
    {
      $group: {
        _id: "$answerCount",
        count: { $sum: 1 },
        avgVotes: { $avg: "$votes" },
      },
    },
    {
      $sort: { "_id": 1 },
    },
  ]);

  // Conversation length distribution
  const conversationLengths = await Conversation.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $project: {
        messageCount: { $size: { $ifNull: ["$messages", []] } },
        isWhatsApp: 1,
        isAnonymous: 1,
      },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $lte: ["$messageCount", 5] },
            "1-5",
            {
              $cond: [
                { $lte: ["$messageCount", 10] },
                "6-10",
                {
                  $cond: [
                    { $lte: ["$messageCount", 20] },
                    "11-20",
                    "20+",
                  ],
                },
              ],
            },
          ],
        },
        count: { $sum: 1 },
        avgLength: { $avg: "$messageCount" },
      },
    },
  ]);

  // Platform comparison stats
  const platformStats = await Conversation.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: "$isWhatsApp",
        total: { $sum: 1 },
        avgMessages: { $avg: { $size: { $ifNull: ["$messages", []] } } },
        totalMessages: { $sum: { $size: { $ifNull: ["$messages", []] } } },
      },
    },
  ]);

  // User activity segments
  const activitySegments = await User.aggregate([
    {
      $lookup: {
        from: "communitymessages",
        localField: "_id",
        foreignField: "userId",
        as: "messages",
      },
    },
    {
      $lookup: {
        from: "communityquestions",
        localField: "_id",
        foreignField: "userId",
        as: "questions",
      },
    },
    {
      $project: {
        totalActivity: {
          $add: [
            { $size: { $ifNull: ["$messages", []] } },
            { $size: { $ifNull: ["$questions", []] } },
          ],
        },
      },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$totalActivity", 0] },
            "Inactive",
            {
              $cond: [
                { $lte: ["$totalActivity", 5] },
                "Low Activity",
                {
                  $cond: [
                    { $lte: ["$totalActivity", 20] },
                    "Moderate Activity",
                    "High Activity",
                  ],
                },
              ],
            },
          ],
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // Calculate trends (comparing first half vs second half of period)
  const midpoint = new Date(startDate.getTime() + (now.getTime() - startDate.getTime()) / 2);
  
  const [firstHalfUsers, secondHalfUsers] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: startDate, $lt: midpoint } }),
    User.countDocuments({ createdAt: { $gte: midpoint } }),
  ]);

  const [firstHalfMessages, secondHalfMessages] = await Promise.all([
    CommunityMessage.countDocuments({ createdAt: { $gte: startDate, $lt: midpoint } }),
    CommunityMessage.countDocuments({ createdAt: { $gte: midpoint } }),
  ]);

  const userTrend = firstHalfUsers > 0 
    ? ((secondHalfUsers - firstHalfUsers) / firstHalfUsers * 100).toFixed(1)
    : 0;
  
  const messageTrend = firstHalfMessages > 0
    ? ((secondHalfMessages - firstHalfMessages) / firstHalfMessages * 100).toFixed(1)
    : 0;

  res.status(200).json({
    success: true,
    data: {
      hourlyActivity: hourlyActivity.map(item => ({
        hour: item._id,
        count: item.count,
      })),
      dayOfWeekActivity: dayOfWeekActivity.map(item => ({
        day: item._id,
        count: item.count,
      })),
      userCohorts: userCohorts.map(item => ({
        period: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        count: item.count,
      })),
      categoryPerformance: categoryPerformance.map(item => ({
        category: item._id,
        total: item.total,
        published: item.published,
        featured: item.featured,
        publishRate: item.total > 0 ? ((item.published / item.total) * 100).toFixed(1) : 0,
      })),
      answerDistribution: answerDistribution.map(item => ({
        answerCount: item._id,
        questionCount: item.count,
        avgVotes: parseFloat(item.avgVotes.toFixed(2)),
      })),
      conversationLengths: conversationLengths.map(item => ({
        range: item._id,
        count: item.count,
        avgLength: parseFloat(item.avgLength.toFixed(2)),
      })),
      platformStats: platformStats.map(item => ({
        platform: item._id ? "WhatsApp" : "Web",
        total: item.total,
        avgMessages: parseFloat(item.avgMessages.toFixed(2)),
        totalMessages: item.totalMessages,
      })),
      activitySegments: activitySegments.map(item => ({
        segment: item._id,
        count: item.count,
      })),
      trends: {
        userTrend: parseFloat(userTrend),
        messageTrend: parseFloat(messageTrend),
      },
      period,
    },
  });
});

// Get predictive analytics
export const getPredictiveAnalytics = catchAsync(async (req, res) => {
  const now = new Date();
  const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const last60d = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Get data for last 60 days to calculate growth rate
  const [users30d, users60d] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: last30d } }),
    User.countDocuments({ createdAt: { $gte: last60d, $lt: last30d } }),
  ]);

  const [messages30d, messages60d] = await Promise.all([
    CommunityMessage.countDocuments({ createdAt: { $gte: last30d } }),
    CommunityMessage.countDocuments({ createdAt: { $gte: last60d, $lt: last30d } }),
  ]);

  const [questions30d, questions60d] = await Promise.all([
    CommunityQuestion.countDocuments({ createdAt: { $gte: last30d } }),
    CommunityQuestion.countDocuments({ createdAt: { $gte: last60d, $lt: last30d } }),
  ]);

  // Calculate growth rates
  const userGrowthRate = users60d > 0 ? (users30d / users60d) : 0;
  const messageGrowthRate = messages60d > 0 ? (messages30d / messages60d) : 0;
  const questionGrowthRate = questions60d > 0 ? (questions30d / questions60d) : 0;

  // Predictions for next 30 days
  const predictedUsers = Math.round(users30d * userGrowthRate);
  const predictedMessages = Math.round(messages30d * messageGrowthRate);
  const predictedQuestions = Math.round(questions30d * questionGrowthRate);

  // Calculate engagement velocity
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.aggregate([
    {
      $lookup: {
        from: "communitymessages",
        localField: "_id",
        foreignField: "userId",
        as: "messages",
      },
    },
    {
      $match: {
        $or: [
          { "messages.0": { $exists: true } },
        ],
      },
    },
    {
      $count: "active",
    },
  ]);

  const activeCount = activeUsers[0]?.active || 0;
  const engagementVelocity = totalUsers > 0 ? (activeCount / totalUsers) * 100 : 0;

  res.status(200).json({
    success: true,
    data: {
      growthRates: {
        users: parseFloat(userGrowthRate.toFixed(2)),
        messages: parseFloat(messageGrowthRate.toFixed(2)),
        questions: parseFloat(questionGrowthRate.toFixed(2)),
      },
      predictions: {
        next30Days: {
          users: predictedUsers,
          messages: predictedMessages,
          questions: predictedQuestions,
        },
      },
      engagementVelocity: parseFloat(engagementVelocity.toFixed(2)),
      currentMetrics: {
        users30d,
        messages30d,
        questions30d,
      },
    },
  });
});
