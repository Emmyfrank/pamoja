import User from "../models/User.js";
import { AppError, catchAsync } from "../utils/index.js";

export const isAdmin = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const userIsAdmin = await User.findOne({ _id, role: "ADMIN" });
  if (!userIsAdmin)
    next(AppError("Can't perform actions ADMIN privileges required"));
  req.user = userIsAdmin;
  next();
});
