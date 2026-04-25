import React, { useEffect, useMemo, useState } from "react";
import { createTask, deleteTask, listTasks, updateTask } from "../api/tasks.js";
import { clearAuth, getUser } from "../auth/authStorage.js";
import { styles } from "./styles.js";

export function TasksPage() {
  const user = getUser();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const completedCount = useMemo(
    () => tasks.filter((t) => t.completed).length,
    [tasks]
  );

  async function refresh() {
    setError("");
    setLoading(true);
    try {
      setTasks(await listTasks());
    } catch (e) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onAdd(e) {
    e.preventDefault();
    setError("");
    const trimmed = title.trim();
    if (!trimmed) return;

    try {
      const created = await createTask({
        title: trimmed,
        description: description.trim()
      });
      setTasks((prev) => [created, ...prev]);
      setTitle("");
      setDescription("");
    } catch (e2) {
      setError(e2?.message ?? "Failed to create");
    }
  }

  async function toggleCompleted(task) {
    setError("");
    const nextCompleted = !task.completed;
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, completed: nextCompleted } : t))
    );
    try {
      await updateTask(task._id, { completed: nextCompleted });
    } catch (e) {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
      setError(e?.message ?? "Failed to update");
    }
  }

  async function remove(task) {
    setError("");
    const prev = tasks;
    setTasks((t) => t.filter((x) => x._id !== task._id));
    try {
      await deleteTask(task._id);
    } catch (e) {
      setTasks(prev);
      setError(e?.message ?? "Failed to delete");
    }
  }

  function logout() {
    clearAuth();
    window.location.href = "/login";
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>Dashboard</h2>
            <div style={styles.subtle}>
              {loading ? "Loading…" : `${completedCount}/${tasks.length} completed`}
              {user?.name ? ` • Signed in as ${user.name}` : ""}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={styles.pill}>Private workspace</div>
            <button type="button" style={styles.buttonGhost} onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div style={{ height: 14 }} />

        <div style={styles.card}>
          <form onSubmit={onAdd} style={{ display: "grid", gap: 10 }}>
            <div style={styles.row}>
              <input
                style={{ ...styles.input, flex: 1 }}
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button style={styles.button} type="submit">
                Add
              </button>
            </div>
            <input
              style={styles.input}
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {error ? <div style={{ color: "#fca5a5" }}>{error}</div> : null}
          </form>
        </div>

        <div style={{ height: 14 }} />

        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
          {tasks.map((t) => (
            <li
              key={t._id}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                justifyContent: "space-between",
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)"
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={styles.row}>
                  <input
                    type="checkbox"
                    checked={!!t.completed}
                    onChange={() => toggleCompleted(t)}
                    style={{ marginTop: 2 }}
                  />
                  <p
                    style={{
                      fontWeight: 650,
                      margin: 0,
                      textDecoration: t.completed ? "line-through" : "none",
                      opacity: t.completed ? 0.7 : 1
                    }}
                  >
                    {t.title}
                  </p>
                </div>
                {t.description ? (
                  <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(229,231,235,0.78)" }}>
                    {t.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => remove(t)}
                style={{ ...styles.button, ...styles.buttonDanger }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {!loading && tasks.length === 0 ? (
          <div style={{ marginTop: 18, ...styles.subtle }}>
            No tasks yet. Add your first one above.
          </div>
        ) : null}
      </div>
    </div>
  );
}

