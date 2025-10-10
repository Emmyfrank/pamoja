import { AppError, catchAsync } from "../utils/index.js";
import CommunityQuestion from "../models/CommunityQuestion.js";
import { moderateContent } from "./moderation.controller.js";

// Questions
export const createQuestion = catchAsync(async (req, res, next) => {
  const { title, content, tags, username, isAnonymous } = req.body;
  const userId = req.user?._id;

  try {
    const moderationResult = await moderateContent(
      {
        body: {
          content: `${title}\n\n${content}`, // Combine title and content for context
          questionContext: "", // No previous context for new questions
          previousMessages: [], // No previous messages for new questions
          isNewQuestion: true, // Flag to indicate this is a new question
        },
      },
      {
        status: (code) => ({
          json: (data) => data,
        }),
      },
      next
    );

    if (!moderationResult.success || !moderationResult.data.isValid) {
      return next(
        AppError(
          moderationResult.data.message || "Content moderation failed",
          400
        )
      );
    }

    // If content is valid but has low relevance score (might be spam or off-topic)
    if (moderationResult.data.relevanceScore < 0.5) {
      return next(
        AppError(
          "Your question appears to be unclear or off-topic. Please ensure your question is clear and relevant to sexual and reproductive health.",
          400
        )
      );
    }

    const question = await CommunityQuestion.create({
      title,
      content,
      tags,
      isAnonymous,
      userId,
      username,
    });

    res.status(201).json({
      success: true,
      data: { question },
    });
  } catch (error) {
    console.error("Error creating question:", error);
    return next(AppError("Failed to process question", 500));
  }
});

export const getQuestions = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10; // Number of posts per page
  const skip = (page - 1) * limit;

  const questions = await CommunityQuestion.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await CommunityQuestion.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      questions,
      pagination: {
        page,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + questions.length < total,
      },
    },
  });
});

export const questionExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const question = await CommunityQuestion.findById(id);

  if (!question) {
    return res.status(404).json({
      success: false,
      message: "Question not found",
    });
  }
  req.question = question;
  next();
});

export const getQuestion = catchAsync(async (req, res) => {
  const { question } = req.question;
  res.status(200).json({
    success: true,
    data: { question },
  });
});

export const addAnswer = catchAsync(async (req, res, next) => {
  const { content, isAnonymous, username } = req.body;
  const userId = req.user?._id;
  const question = req.question;

  // Get the last 5 messages for context directly from the question
  const lastMessages = question.answers
    .slice(-5)
    .map((answer) => answer.content);

  try {
    const moderationResult = await moderateContent(
      {
        body: {
          content,
          questionContext: question.content,
          previousMessages: lastMessages,
        },
      },
      {
        status: (code) => ({
          json: (data) => data,
        }),
      },
      next
    );

    if (!moderationResult.success || !moderationResult.data.isValid) {
      return next(
        AppError(moderationResult.data.message || "Content moderation failed")
      );
    }

    // If content is valid but has low relevance, warn or reject
    if (moderationResult.data.relevanceScore < 0.5) {
      return next(
        AppError(
          "Your response appears to be unrelated to the question or ongoing discussion. Please ensure your answer is relevant to the topic."
        )
      );
    }

    question.answers.push({
      content,
      isAnonymous,
      userId,
      username,
    });

    await question.save();

    res.status(201).json({
      success: true,
      data: { question },
    });
  } catch (error) {
    console.log(error);

    return next(AppError("Failed to process answer"));
  }
});

// Voting
export const voteQuestion = catchAsync(async (req, res) => {
  const userId = req.user?._id;
  const question = req.question;

  if (question.voters?.includes(userId)) {
    a;
    question.votes -= 1;
    question.voters = question.voters.filter(
      (voterId) => voterId.toString() !== userId?.toString()
    );
  } else {
    question.votes = (question.votes || 0) + 1;
    if (!question.voters) question.voters = [];
    if (userId) question.voters.push(userId);
  }

  await question.save();

  res.status(200).json({
    success: true,
    data: { question },
  });
});
