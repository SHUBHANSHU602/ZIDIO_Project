import rateLimit from "express-rate-limit";
import { HttpError } from "../utils/httpError.js";

const BLOCKED_KEYS = new Set(["__proto__", "prototype", "constructor"]);

function assertSafeObject(value, path = "body", depth = 0) {
  if (depth > 20) throw new HttpError(400, "Request structure is too deeply nested");
  if (value === null || typeof value !== "object") return;

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      assertSafeObject(value[index], `${path}[${index}]`, depth + 1);
    }
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    if (BLOCKED_KEYS.has(key) || key.startsWith("$") || key.includes(".")) {
      throw new HttpError(400, "Unsafe request key", { path: `${path}.${key}` });
    }
    assertSafeObject(child, `${path}.${key}`, depth + 1);
  }
}

export function rejectUnsafeRequestKeys(req, _res, next) {
  try {
    assertSafeObject(req.body, "body");
    assertSafeObject(req.query, "query");
    next();
  } catch (error) {
    next(error);
  }
}

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: Number(process.env.API_RATE_LIMIT_PER_MINUTE || 300),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  message: { success: false, error: "Too many requests" },
});
