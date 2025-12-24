import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import ArticleList from "./components/ArticleList";
import ArticleView from "./components/ArticleView";
import ArticleEditor from "./components/ArticleEditor";

import Login from "./auth/Login";
import Register from "./auth/Register";
import RequireAuth from "./auth/RequireAuth";
import RedirectIfAuth from "./auth/RedirectIfAuth";
import Logout from "./components/Logout";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
        <h1>Articles App</h1>

        <Routes>
          {/* Публичные маршруты */}
          <Route path="/login" element={ <RedirectIfAuth> <Login /> </RedirectIfAuth> } /> <Route path="/register" element={ <RedirectIfAuth> <Register /> </RedirectIfAuth> } />
          <Route path="/logout" element={<Logout />} />

          {/* Защищённые маршруты */}
          <Route element={<RequireAuth />}>
            <Route path="/" element={<ArticleList />} />
            <Route path="/article/:id" element={<ArticleView />} />
            <Route path="/create" element={<ArticleEditor mode="create" />} />
            <Route path="/edit/:id" element={<ArticleEditor mode="edit" />} />
          </Route>

          {/* Редирект по умолчанию на регистрацию */}
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
