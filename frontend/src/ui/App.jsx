import React, { useEffect, useMemo, useState } from "react";
import { createTask, deleteTask, listTasks, updateTask } from "../api/tasks.js";

const styles = {
  page: {
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
    margin: 0,
    minHeight: "100vh",
    background: "#0b1220",
    color: "#e5e7eb"
  },
  container: { maxWidth: 820, margin: "0 auto", padding: "40px 20px" },
  card: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 14,
    padding: 16
  },
  row: { display: "flex", gap: 10, alignItems: "center" },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.25)",
    color: "#e5e7eb",
    outline: "none"
  },
  button: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(59,130,246,0.85)",
    color: "white",
    cursor: "pointer"
  },
  subtle: { color: "rgba(229,231,235,0.75)" },
  list: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 },
  item: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)"
  },
  title: { fontWeight: 650, margin: 0 },
  desc: { margin: "6px 0 0", fontSize: 13, color: "rgba(229,231,235,0.78)" },
  pill: {
    fontSize: 12,
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.18)"
  },
  danger: {
    background: "rgba(239,68,68,0.88)",
    borderColor: "rgba(239,68,68,0.55)"
  }
};

export function App() {
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
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? task : t))
      );
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

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>Task Manager</h2>
            <div style={styles.subtle}>
              {loading ? "Loading…" : `${completedCount}/${tasks.length} completed`}
            </div>
          </div>
          <div style={styles.pill}>MongoDB-backed</div>
        </div>

        <div style={{ height: 14 }} />

        <div style={styles.card}>
          <form onSubmit={onAdd} style={{ display: "grid", gap: 10 }}>
            <div style={styles.row}>
              <input
                style={styles.input}
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

        <ul style={styles.list}>
          {tasks.map((t) => (
            <li key={t._id} style={styles.item}>
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
                      ...styles.title,
                      textDecoration: t.completed ? "line-through" : "none",
                      opacity: t.completed ? 0.7 : 1
                    }}
                  >
                    {t.title}
                  </p>
                </div>
                {t.description ? <p style={styles.desc}>{t.description}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => remove(t)}
                style={{ ...styles.button, ...styles.danger }}
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

