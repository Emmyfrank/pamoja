import jwt from "jsonwebtoken";

import { AppError, logger } from "../utils/index.js";

export const isLoggedIn = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) next(AppError("Unauthorized token not found"));
    const tokenIsValid = jwt.verify(token, process.env.SECRET_KEY);
    if (!tokenIsValid) next(AppError("Invalid token"));
    req.user = { _id: tokenIsValid.id, username: tokenIsValid.username };
    next();
  } catch (error) {
    logger.error(error || "Error checking auth");
    next(AppError("Invalid token signature"));
  }
};
