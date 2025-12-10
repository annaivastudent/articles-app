import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ArticleList from "./components/ArticleList";
import ArticleView from "./components/ArticleView";
import ArticleEditor from "./components/ArticleEditor";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
        <h1>Articles App</h1>
        <Routes>
          <Route path="/" element={<ArticleList />} />
          <Route path="/article/:id" element={<ArticleView />} />
          <Route path="/create" element={<ArticleEditor mode="create" />} />
          <Route path="/edit/:id" element={<ArticleEditor mode="edit" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
