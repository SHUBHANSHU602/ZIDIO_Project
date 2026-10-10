import {
  loginUser,
  registerUser,
  revokeRefreshToken,
  rotateRefreshToken,
} from "../services/authService.js";
import { HttpError } from "../utils/httpError.js";

export async function register(req, res, next) {
  try {
    const result = await registerUser(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = await loginUser(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body ?? {};
    if (!refreshToken) throw new HttpError(400, "refreshToken is required");
    const result = await rotateRefreshToken(refreshToken);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    await revokeRefreshToken(req.auth.userId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
