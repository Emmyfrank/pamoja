import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";
import { AppError } from "../utils/AppError.js";

export const generateToken = (req, res, next) => {
  try {
    const token = jwt.sign(
      { id: req.user._id, username: req.user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res
      .status(200)
      .json({
        success: true,
        data: {
          token,
          user: {
            username: req.user.username,
            _id: req.user._id,
            isAnonymous: req.user.isAnonymous,
            role: req.user.role || "USER",
          },
        },
      });
  } catch (error) {
    console.log(error);
    logger.error(error?.message || "Error generating token");
    next(AppError("Error generating token"));
  }
};
