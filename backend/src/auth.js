import jwt from "jsonwebtoken";
import { env } from "./env.js";

export function signToken({ userId }) {
  if (!env.JWT_SECRET) throw new Error("Missing JWT_SECRET");
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: "7d" });
}

export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization ?? "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Missing auth token" });
    }

    if (!env.JWT_SECRET) return res.status(500).json({ message: "Server misconfigured" });

    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: String(payload.sub) };
    next();
  } catch {
    res.status(401).json({ message: "Invalid auth token" });
  }
}

