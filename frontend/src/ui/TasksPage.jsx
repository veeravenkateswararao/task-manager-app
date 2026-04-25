import React, { useEffect, useMemo, useState } from "react";
import { createTask, deleteTask, listTasks, updateTask } from "../api/tasks.js";
import { clearAuth, getUser } from "../auth/authStorage.js";
import { styles } from "./styles.js";
import { Brand, IconProject, IconUser, LogoMark } from "./Brand.jsx";

export function TasksPage() {
  const user = getUser();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizedTasks = useMemo(
    () =>
      tasks.map((t) => {
        const status = t.status ?? (t.completed ? "done" : "todo");
        return { ...t, status };
      }),
    [tasks]
  );

  const completedCount = useMemo(
    () => normalizedTasks.filter((t) => t.status === "done").length,
    [normalizedTasks]
  );
  const todoTasks = useMemo(() => normalizedTasks.filter((t) => t.status !== "done"), [normalizedTasks]);
  const doneTasks = useMemo(() => normalizedTasks.filter((t) => t.status === "done"), [normalizedTasks]);

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
    const currentStatus = task.status ?? (task.completed ? "done" : "todo");
    const nextStatus = currentStatus === "done" ? "todo" : "done";
    setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t)));
    try {
      await updateTask(task._id, { status: nextStatus });
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

  function fmtDate(iso) {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return "";
    }
  }

  const initials = (() => {
    const name = user?.name ?? "";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? "U";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  })();

  return (
    <div style={styles.page}>
      <div style={styles.appShell}>
        <aside style={styles.sidebar}>
          <Brand subtitle={user?.name ? `${user.name}'s workspace` : "Workspace"} />

          <div style={{ height: 18 }} />

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <IconUser />
            <div style={{ fontSize: 12, ...styles.subtle }}>PERSON</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              padding: 10,
              borderRadius: 12,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(2,6,23,0.45)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  fontWeight: 900
                }}
                title={user?.name ?? "User"}
              >
                {initials}
              </div>
              <div>
                <div style={{ fontWeight: 850, fontSize: 13 }}>{user?.name ?? "User"}</div>
                <div style={{ fontSize: 12, ...styles.subtle }}>{user?.email ?? "Signed in"}</div>
              </div>
            </div>
          </div>

          <div style={{ height: 16 }} />

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <IconProject />
            <div style={{ fontSize: 12, ...styles.subtle }}>PROJECT</div>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ padding: 10, borderRadius: 12, background: "rgba(255,255,255,0.06)" }}>
              Board
            </div>
            <div style={{ padding: 10, borderRadius: 12, color: "rgba(230,238,252,0.75)" }}>
              Backlog
            </div>
            <div style={{ padding: 10, borderRadius: 12, color: "rgba(230,238,252,0.75)" }}>
              Reports
            </div>
          </div>
        </aside>

        <main style={styles.content}>
          <div style={styles.topbar}>
            <div>
              <div style={{ fontSize: 12, ...styles.subtle }}>Project / Board</div>
              <div style={{ fontWeight: 850, fontSize: 18 }}>My Tasks</div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ fontSize: 13, ...styles.subtle }}>
                {loading ? "Loading…" : `${completedCount}/${tasks.length} done`}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)"
                }}
              >
                <LogoMark size={20} />
                <IconUser />
                <div style={{ fontSize: 13, fontWeight: 800 }}>{user?.name ?? "User"}</div>
              </div>
              <button type="button" style={styles.buttonGhost} onClick={logout}>
                Logout
              </button>
            </div>
          </div>

          <div style={{ padding: "14px 18px" }}>
            <div style={styles.card}>
              <form onSubmit={onAdd} style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    style={{ ...styles.input, flex: 1 }}
                    placeholder="Create issue…"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <button style={styles.button} type="submit">
                    Create
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
          </div>

          <div style={styles.board}>
            <section style={styles.column}>
              <div style={styles.columnHeader}>
                <div style={{ fontWeight: 800 }}>To do</div>
                <div style={styles.subtle}>{todoTasks.length}</div>
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {todoTasks.map((t) => (
                  <div key={t._id} style={styles.cardItem}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <p style={styles.cardTitle}>{t.title}</p>
                        {t.description ? (
                          <div style={styles.cardMeta}>{t.description}</div>
                        ) : (
                          <div style={styles.cardMeta}>No description</div>
                        )}
                        <div style={styles.cardMeta}>Created {fmtDate(t.createdAt)}</div>
                      </div>
                      <div style={{ display: "grid", gap: 8 }}>
                        <button
                          type="button"
                          onClick={() => toggleCompleted(t)}
                          style={styles.buttonGhost}
                        >
                          Done
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(t)}
                          style={{ ...styles.buttonGhost, borderColor: "rgba(239,68,68,0.45)" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {!loading && todoTasks.length === 0 ? (
                  <div style={{ ...styles.subtle, fontSize: 13, padding: 8 }}>
                    Nothing here. Create your first issue above.
                  </div>
                ) : null}
              </div>
            </section>

            <section style={styles.column}>
              <div style={styles.columnHeader}>
                <div style={{ fontWeight: 800 }}>Done</div>
                <div style={styles.subtle}>{doneTasks.length}</div>
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {doneTasks.map((t) => (
                  <div key={t._id} style={{ ...styles.cardItem, opacity: 0.9 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ ...styles.cardTitle, textDecoration: "line-through" }}>
                          {t.title}
                        </p>
                        {t.description ? <div style={styles.cardMeta}>{t.description}</div> : null}
                        <div style={styles.cardMeta}>Completed</div>
                      </div>
                      <div style={{ display: "grid", gap: 8 }}>
                        <button
                          type="button"
                          onClick={() => toggleCompleted(t)}
                          style={styles.buttonGhost}
                        >
                          Undo
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(t)}
                          style={{ ...styles.buttonGhost, borderColor: "rgba(239,68,68,0.45)" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {!loading && doneTasks.length === 0 ? (
                  <div style={{ ...styles.subtle, fontSize: 13, padding: 8 }}>
                    Completed issues will show here.
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

