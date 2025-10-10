import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import swaggerjsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import connectDatabase from "./config/database.js";
import routes from "./routes/index.js";
import { errorResponse, logger, swaggerOptions } from "./utils/index.js";

dotenv.config();

const app = new express();
const PORT = process.env.PORT;
const swaggerDocs = swaggerjsdoc(swaggerOptions);

// middlewares
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [
      "https://www.pamoja.health",
      "https://pamoja-9q5s.onrender.com",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// api endpoints
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/v1", routes);

app.use((req, res, next) => {
  const err = new Error("Route not found");
  err.status = 404;
  next(err);
});

// global error handler
app.use(errorResponse);

app.listen(PORT, () => {
  connectDatabase();
  logger.info(`Server running on PORT ${PORT}`);
});
