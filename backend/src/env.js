import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 4000),
  MONGODB_URI: process.env.MONGODB_URI ?? "",
  JWT_SECRET:
    process.env.JWT_SECRET ??
    (process.env.NODE_ENV === "production" ? "" : "dev_secret_change_me")
};

