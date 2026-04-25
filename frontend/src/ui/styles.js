export const ui = {
  font:
    'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
  bg: "#0b1220",
  fg: "#e5e7eb",
  subtle: "rgba(229,231,235,0.75)",
  cardBg: "rgba(255,255,255,0.06)",
  cardBorder: "rgba(255,255,255,0.12)",
  fieldBorder: "rgba(255,255,255,0.18)",
  primary: "rgba(59,130,246,0.85)",
  danger: "rgba(239,68,68,0.88)",
  glow: "rgba(59,130,246,0.18)"
};

export const styles = {
  page: {
    fontFamily: ui.font,
    margin: 0,
    minHeight: "100vh",
    background: `radial-gradient(1200px 700px at 15% 10%, ${ui.glow}, transparent 55%),
      radial-gradient(900px 600px at 85% 30%, rgba(34,197,94,0.12), transparent 60%),
      ${ui.bg}`,
    color: ui.fg
  },
  container: { maxWidth: 920, margin: "0 auto", padding: "40px 20px" },
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
    background: "rgba(0,0,0,0.25)",
    color: ui.fg,
    outline: "none"
  },
  inputGroup: { display: "flex", gap: 10, alignItems: "stretch" },
  inputRight: {
    width: 110,
    padding: "10px 10px",
    borderRadius: 10,
    border: `1px solid ${ui.fieldBorder}`,
    background: "rgba(255,255,255,0.06)",
    color: ui.fg,
    cursor: "pointer",
    fontWeight: 650
  },
  button: {
    padding: "10px 12px",
    borderRadius: 10,
    border: `1px solid ${ui.fieldBorder}`,
    background: ui.primary,
    color: "white",
    cursor: "pointer",
    fontWeight: 650
  },
  buttonGhost: {
    padding: "10px 12px",
    borderRadius: 10,
    border: `1px solid ${ui.fieldBorder}`,
    background: "transparent",
    color: ui.fg,
    cursor: "pointer",
    fontWeight: 650
  },
  buttonDanger: {
    background: ui.danger,
    borderColor: "rgba(239,68,68,0.55)"
  },
  subtle: { color: ui.subtle },
  pill: {
    fontSize: 12,
    padding: "4px 8px",
    borderRadius: 999,
    border: `1px solid rgba(255,255,255,0.14)`,
    background: "rgba(0,0,0,0.18)"
  },
  label: { color: ui.subtle, fontSize: 13, marginBottom: 6 }
};

