import express from "express";
import cors from "cors";
import morgan from "morgan";

import { env } from "./env.js";
import { connectToMongo } from "./db.js";
import { tasksRouter } from "./routes/tasks.js";
import { authRouter } from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);

app.use((err, req, res, next) => {
  const status = err?.name === "ValidationError" ? 400 : 500;
  res.status(status).json({
    message: err?.message ?? "Server error"
  });
});

await connectToMongo(env.MONGODB_URI);
app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${env.PORT}`);
});

