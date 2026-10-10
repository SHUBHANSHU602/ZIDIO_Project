import { HttpError } from "../utils/httpError.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(req, _res, next) {
  const { name, email, password } = req.body ?? {};
  const errors = [];

  if (typeof name !== "string" || name.trim().length < 2) errors.push("name must contain at least 2 characters");
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) errors.push("email must be valid");
  if (typeof password !== "string" || password.length < 8) errors.push("password must contain at least 8 characters");

  if (errors.length) return next(new HttpError(400, "Invalid registration data", errors));
  next();
}

export function validateLogin(req, _res, next) {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    return next(new HttpError(400, "email and password are required"));
  }
  next();
}
