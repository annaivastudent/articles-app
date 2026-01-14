import React from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";

import ArticleList from "./components/ArticleList";
import ArticleView from "./components/ArticleView";
import ArticleEditor from "./components/ArticleEditor";

import Login from "./auth/Login";
import Register from "./auth/Register";
import RequireAuth from "./auth/RequireAuth";
import RedirectIfAuth from "./auth/RedirectIfAuth";
import Logout from "./components/Logout";
import AdminUsers from "./auth/AdminUsers";

function App() {
  const role = localStorage.getItem("role");
  const location = useLocation();

  const isPublicPage = ["/login", "/register"].includes(location.pathname);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>Articles App</h1>

      {!isPublicPage && role === "admin" && (
        <div style={{ marginBottom: "10px" }}>
          <Link to="/admin/users">User Management</Link>
        </div>
      )}

      <Routes>
        <Route
          path="/login"
          element={
            <RedirectIfAuth>
              <Login />
            </RedirectIfAuth>
          }
        />

        <Route
          path="/register"
          element={
            <RedirectIfAuth>
              <Register />
            </RedirectIfAuth>
          }
        />

        <Route path="/logout" element={<Logout />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<ArticleList />} />
          <Route path="/article/:id" element={<ArticleView />} />
          <Route path="/create" element={<ArticleEditor mode="create" />} />
          <Route path="/edit/:id" element={<ArticleEditor mode="edit" />} />

          <Route
            path="/admin/users"
            element={role === "admin" ? <AdminUsers /> : <Navigate to="/" />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </div>
  );
}

export default App;
