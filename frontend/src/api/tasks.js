import { request } from "./http.js";

export async function listTasks() {
  return await request("/api/tasks");
}

export async function createTask({ title, description }) {
  return await request("/api/tasks", {
    method: "POST",
    body: JSON.stringify({ title, description })
  });
}

export async function updateTask(id, patch) {
  return await request(`/api/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch)
  });
}

export async function deleteTask(id) {
  await request(`/api/tasks/${id}`, { method: "DELETE" });
}

