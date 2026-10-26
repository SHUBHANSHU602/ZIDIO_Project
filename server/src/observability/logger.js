import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  base: {
    service: "intellmeet-api",
    env: process.env.NODE_ENV || "development",
  },
  redact: {
    paths: [
      "req.headers.authorization",
      "authorization",
      "refreshToken",
      "password",
      "passwordHash",
      "token",
      "*.password",
      "*.token",
    ],
    censor: "[REDACTED]",
  },
});
