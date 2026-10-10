import express from "express";
import cors from "cors";
import helmet from "helmet";

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

  return app;
}
