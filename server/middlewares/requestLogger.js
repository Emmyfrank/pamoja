import { logger } from "../utils/index.js";

export const requestLogger = (req, res, next) => {
  logger.info(`${req.method} request incoming to endpoint ${req.originalUrl}`);
  next();
};
