import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { getToken } from "./auth/authStorage.js";
import { AuthPage } from "./ui/AuthPage.jsx";
import { TasksPage } from "./ui/TasksPage.jsx";

function Protected({ children }) {
  const location = useLocation();
  const token = getToken();
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <TasksPage />
            </Protected>
          }
        />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

