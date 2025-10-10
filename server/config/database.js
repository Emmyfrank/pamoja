import mongoose from "mongoose";
import { logger } from "../utils/index.js";

const connectDatabase = async () => {
  const conn = process.env.MONGODB_URI;
  try {
    const res = await mongoose.connect(conn);
    logger.info(`Connected to database ${res.connection.host}`);
  } catch (error) {
    logger.error(`Failed to connect to database, ${error}`);
  }
};

export default connectDatabase;
