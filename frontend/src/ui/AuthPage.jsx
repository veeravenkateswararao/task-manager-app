import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login, signup } from "../api/auth.js";
import { getToken, setAuth } from "../auth/authStorage.js";
import { styles } from "./styles.js";

export function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || "/";
  const alreadyAuthed = !!getToken();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (!email.trim() || !password) {
        setError("Email and password are required");
        return;
      }
      if (isSignup && !name.trim()) {
        setError("Name is required");
        return;
      }
      const data = isSignup
        ? await signup({ name: name.trim(), email: email.trim(), password })
        : await login({ email: email.trim(), password });

      setAuth({ token: data.token, user: data.user });
      nav(from, { replace: true });
    } catch (err) {
      setError(err?.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (alreadyAuthed) nav("/", { replace: true });
  }, [alreadyAuthed, nav]);

  if (alreadyAuthed) return null;

  return (
    <div style={styles.page}>
      <div style={{ ...styles.container, maxWidth: 520 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>{isSignup ? "Create account" : "Welcome back"}</h2>
            <div style={styles.subtle}>
              {isSignup ? "Sign up to save tasks securely." : "Log in to access your tasks."}
            </div>
          </div>
          <div style={styles.pill}>Secure JWT</div>
        </div>

        <div style={{ height: 14 }} />

        <div style={styles.card}>
          <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
            {isSignup ? (
              <div>
                <div style={styles.label}>Name</div>
                <input
                  style={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
            ) : null}

            <div>
              <div style={styles.label}>Email</div>
              <input
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <div style={styles.label}>Password</div>
              <div style={styles.inputGroup}>
                <input
                  style={styles.input}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? "Min 6 characters" : "Your password"}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={styles.inputRight}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error ? <div style={{ color: "#fca5a5" }}>{error}</div> : null}

            <button style={styles.button} type="submit" disabled={busy}>
              {busy ? "Please wait…" : isSignup ? "Sign up" : "Log in"}
            </button>

            <div style={{ ...styles.subtle, fontSize: 13 }}>
              {isSignup ? (
                <>
                  Already have an account? <Link to="/login">Log in</Link>
                </>
              ) : (
                <>
                  New here? <Link to="/signup">Create an account</Link>
                </>
              )}
            </div>
          </form>
        </div>

        <div style={{ height: 12 }} />

        <div style={{ ...styles.subtle, fontSize: 12, lineHeight: 1.6 }}>
          Tip: use any email you like for local testing.
        </div>
      </div>
    </div>
  );
}

