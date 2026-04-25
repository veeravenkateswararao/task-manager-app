export const ui = {
  font:
    'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
  bg: "#0b1220",
  fg: "#e6eefc",
  subtle: "rgba(230,238,252,0.72)",
  cardBg: "rgba(255,255,255,0.05)",
  cardBorder: "rgba(255,255,255,0.10)",
  fieldBg: "rgba(2,6,23,0.55)",
  fieldBorder: "rgba(148,163,184,0.25)",
  primary: "#1d4ed8",
  primary2: "#0ea5e9",
  danger: "#ef4444",
  surface2: "rgba(255,255,255,0.08)"
};

export const styles = {
  page: {
    fontFamily: ui.font,
    margin: 0,
    minHeight: "100vh",
    background: `radial-gradient(1200px 700px at 12% 10%, rgba(29,78,216,0.22), transparent 55%),
      radial-gradient(900px 600px at 88% 30%, rgba(14,165,233,0.16), transparent 60%),
      ${ui.bg}`,
    color: ui.fg
  },
  container: { maxWidth: 1100, margin: "0 auto", padding: "28px 20px" },
  card: {
    background: ui.cardBg,
    border: `1px solid ${ui.cardBorder}`,
    borderRadius: 14,
    padding: 16,
    boxShadow: "0 18px 55px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)"
  },
  row: { display: "flex", gap: 10, alignItems: "center" },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: `1px solid ${ui.fieldBorder}`,
    background: ui.fieldBg,
    color: ui.fg,
    outline: "none"
  },
  inputGroup: { display: "flex", gap: 10, alignItems: "stretch" },
  inputRight: {
    width: 110,
    padding: "10px 10px",
    borderRadius: 10,
    border: `1px solid ${ui.fieldBorder}`,
    background: ui.surface2,
    color: ui.fg,
    cursor: "pointer",
    fontWeight: 650
  },
  button: {
    padding: "10px 12px",
    borderRadius: 10,
    border: `1px solid ${ui.fieldBorder}`,
    background: `linear-gradient(135deg, ${ui.primary}, ${ui.primary2})`,
    color: "white",
    cursor: "pointer",
    fontWeight: 650
  },
  buttonGhost: {
    padding: "10px 12px",
    borderRadius: 10,
    border: `1px solid ${ui.fieldBorder}`,
    background: "rgba(255,255,255,0.03)",
    color: ui.fg,
    cursor: "pointer",
    fontWeight: 650
  },
  buttonDanger: {
    background: ui.danger,
    borderColor: "rgba(239,68,68,0.55)"
  },
  subtle: { color: ui.subtle },
  label: { color: ui.subtle, fontSize: 13, marginBottom: 6 },

  // Jira-like layout helpers
  appShell: { display: "flex", minHeight: "100vh" },
  sidebar: {
    width: 260,
    padding: 16,
    borderRight: `1px solid ${ui.cardBorder}`,
    background: "rgba(2,6,23,0.35)"
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "14px 18px",
    borderBottom: `1px solid ${ui.cardBorder}`,
    background: "rgba(2,6,23,0.35)",
    backdropFilter: "blur(10px)"
  },
  content: { flex: 1, display: "flex", flexDirection: "column" },
  board: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: 18 },
  column: {
    border: `1px solid ${ui.cardBorder}`,
    background: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: 12,
    minHeight: 320
  },
  columnHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  cardItem: {
    border: `1px solid ${ui.cardBorder}`,
    background: "rgba(2,6,23,0.35)",
    borderRadius: 12,
    padding: 12,
    boxShadow: "0 10px 24px rgba(0,0,0,0.25)"
  },
  cardTitle: { margin: 0, fontWeight: 700, fontSize: 14 },
  cardMeta: { marginTop: 6, fontSize: 12, color: ui.subtle }
};

