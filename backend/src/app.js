import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import userRoutes from "./routes/user.routes.js";

import errorHandler from "./middleware/error/errorHandler.js";
import STATUS_CODES from "./constants/http/statusCodes.js";

const app = express();

// Security Middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Logging
app.use(morgan("dev"));

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).json({
    success: false,
    message: "Route not found",
    errors: [],
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;