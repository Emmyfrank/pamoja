import Testimonial from "../models/Testimonial.js";
import { AppError, catchAsync } from "../utils/index.js";
import { moderateContent } from "./moderation.controller.js";

export const addTestimonial = catchAsync(async (req, res, next) => {
  const { rating, story, name, location } = req.body;

  try {
    const moderationResult = await moderateContent(
      {
        body: {
          content: story,
          questionContext: "Testimonial submission for Pamoja platform",
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
          moderationResult.data.message ||
            "Your testimonial contains inappropriate content. Please ensure it is respectful and health-related.",
          400
        )
      );
    }

    // Check for spam or promotional content
    if (moderationResult.data.category === "spam") {
      return next(
        AppError(
          "Your testimonial appears to contain promotional content. Please share your genuine experience instead.",
          400
        )
      );
    }

    // Ensure the content is health-related
    if (moderationResult.data.relevanceScore < 0.5) {
      return next(
        AppError(
          "Your testimonial should be related to your experience with sexual and reproductive health services.",
          400
        )
      );
    }

    const testimonial = await Testimonial.create({
      rating,
      story,
      name,
      location,
    });
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    return next(AppError("Failed to submit testimonial", 500));
  }
});

export const getAllTestimonials = catchAsync(async (req, res, next) => {
  const testimonials = await Testimonial.aggregate([{ $sample: { size: 5 } }]);
  res.status(200).json({ success: true, data: testimonials });
});
