import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/register" replace />;
  }

  return <Outlet />;
}
