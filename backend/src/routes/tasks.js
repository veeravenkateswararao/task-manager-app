import { Router } from "express";
import { Task } from "../models/Task.js";
import { requireAuth } from "../auth.js";

export const tasksRouter = Router();

tasksRouter.use(requireAuth);

tasksRouter.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

tasksRouter.post("/", async (req, res, next) => {
  try {
    const { title, description, status, completed } = req.body ?? {};
    const normalizedStatus =
      status === "done" || completed === true ? "done" : status === "todo" ? "todo" : "todo";
    const task = await Task.create({
      userId: req.user.id,
      title,
      description,
      status: normalizedStatus,
      completed: normalizedStatus === "done"
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

tasksRouter.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...(req.body ?? {}) };

    // Allow either `completed` or `status` from clients.
    if (typeof updates.completed === "boolean") {
      updates.status = updates.completed ? "done" : "todo";
    }
    if (updates.status === "done" || updates.status === "todo") {
      updates.completed = updates.status === "done";
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updates,
      {
      new: true,
      runValidators: true
      }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

tasksRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

