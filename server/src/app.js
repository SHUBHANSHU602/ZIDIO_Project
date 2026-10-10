import express from "express";
import cors from "cors";
import helmet from "helmet";
import actionItemRoutes from "./routes/actionItemRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") ?? true,
    credentials: true,
  }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.status(200).json({
      success: true,
      service: "intellmeet-api",
      status: "ok",
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/teams", teamRoutes);
  app.use("/api/meetings", meetingRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api", actionItemRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
