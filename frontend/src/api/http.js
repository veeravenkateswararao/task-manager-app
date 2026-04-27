import { getToken } from "../auth/authStorage.js";

const API_BASE = "http://13.206.70.9:4000";

export async function request(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const contentType = res.headers.get("content-type") || "";

  if (res.status === 204) return null;

  const body = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const msg =
      typeof body === "object" && body && "message" in body
        ? body.message
        : "Request failed";

    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return body;
}
