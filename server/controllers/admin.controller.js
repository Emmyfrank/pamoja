import { catchAsync, AppError } from "../utils/index.js";
import User from "../models/User.js";
import LearningMaterial from "../models/LearningMaterial.js";
import CommunityMessage from "../models/CommunityMessage.js";
import CommunityQuestion from "../models/CommunityQuestion.js";
import Conversation from "../models/Conversation.js";
import Suggestion from "../models/Suggestion.js";
import Testimonial from "../models/Testimonial.js";

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

// Get all users
export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find()
    .select("-password -personalInfoHash")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    data: { users },
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
  const { period = "30d" } = req.query;

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
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  // Get daily user registrations
  const userGrowth = await User.aggregate([
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
          day: { $dayOfMonth: "$createdAt" },
        },
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
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
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
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        cumulative: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
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
  const { period = "30d" } = req.query;

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
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  // Messages over time
  const messageEngagement = await CommunityMessage.aggregate([
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
          day: { $dayOfMonth: "$createdAt" },
        },
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
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
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
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        count: { $sum: 1 },
        totalAnswers: { $sum: { $size: "$answers" } },
        totalVotes: { $sum: "$votes" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
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
  const { period = "30d" } = req.query;

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
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  // Conversation trends
  const conversationTrends = await Conversation.aggregate([
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
          day: { $dayOfMonth: "$createdAt" },
        },
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
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
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
  const { period = "30d" } = req.query;

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
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
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

  // Materials over time
  const materialsOverTime = await LearningMaterial.aggregate([
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
          day: { $dayOfMonth: "$createdAt" },
        },
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
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
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
    },
  });
});
