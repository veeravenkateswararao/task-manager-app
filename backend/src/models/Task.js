import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    // New canonical field for Jira-like board
    status: { type: String, enum: ["todo", "done"], default: "todo", index: true },

    // Backward compatibility for earlier UI/API
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);

