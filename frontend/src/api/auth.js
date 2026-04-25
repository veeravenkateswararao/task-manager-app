import { request } from "./http.js";

export async function signup({ name, email, password }) {
  return await request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password })
  });
}

export async function login({ email, password }) {
  return await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

