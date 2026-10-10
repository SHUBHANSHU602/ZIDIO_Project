import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { HttpError } from "../utils/httpError.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens.js";

const PASSWORD_ROUNDS = 12;

async function issueTokens(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  user.refreshTokenHash = await bcrypt.hash(refreshToken, PASSWORD_ROUNDS);
  await user.save();

  return { accessToken, refreshToken };
}

export async function registerUser({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.exists({ email: normalizedEmail });
  if (existing) throw new HttpError(409, "Email is already registered");

  const passwordHash = await bcrypt.hash(password, PASSWORD_ROUNDS);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });
  const tokens = await issueTokens(user);

  return { user, ...tokens };
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash +refreshTokenHash");

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HttpError(401, "Invalid email or password");
  }

  const tokens = await issueTokens(user);
  return { user, ...tokens };
}

export async function rotateRefreshToken(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new HttpError(401, "Invalid or expired refresh token");
  }

  if (payload.type !== "refresh") throw new HttpError(401, "Invalid refresh token");

  const user = await User.findById(payload.sub).select("+refreshTokenHash");
  if (!user?.refreshTokenHash || !(await bcrypt.compare(refreshToken, user.refreshTokenHash))) {
    throw new HttpError(401, "Refresh token has been revoked");
  }

  const tokens = await issueTokens(user);
  return { user, ...tokens };
}

export async function revokeRefreshToken(userId) {
  await User.findByIdAndUpdate(userId, { $set: { refreshTokenHash: null } });
}
