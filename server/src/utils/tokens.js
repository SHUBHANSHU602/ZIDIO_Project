import jwt from "jsonwebtoken";

function requireSecret(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    requireSecret("JWT_ACCESS_SECRET"),
    { expiresIn: process.env.JWT_ACCESS_TTL || "15m" }
  );
}

export function signRefreshToken(user) {
  return jwt.sign(
    { sub: user.id, type: "refresh" },
    requireSecret("JWT_REFRESH_SECRET"),
    { expiresIn: process.env.JWT_REFRESH_TTL || "7d" }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, requireSecret("JWT_ACCESS_SECRET"));
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, requireSecret("JWT_REFRESH_SECRET"));
}
