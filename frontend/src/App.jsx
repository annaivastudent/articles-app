import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function App() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [mode, setMode] = useState("list");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/articles");
      setArticles(res.data);
    } catch (err) {
      console.error("Error fetching articles:", err);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/articles/${id}`);
      setSelectedArticle(res.data);
      setMode("view");
    } catch (err) {
      alert("Error loading article");
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("Title and content are required!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/articles", { title, content });
      setTitle("");
      setContent("");
      fetchArticles();
      setMode("list");
    } catch (err) {
      alert("Error creating article");
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/articles/${id}`);
      setSelectedArticle(res.data);
      setTitle(res.data.title);
      setContent(res.data.content);
      setMode("edit");
    } catch (err) {
      alert("Error loading article for editing");
    }
  };

  const handleUpdate = async () => {
    if (!title || !content) {
      alert("Title and content are required!");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/articles/${selectedArticle.id}`, {
        title,
        content,
      });
      alert("Article updated!");
      setTitle("");
      setContent("");
      fetchArticles();
      setMode("list");
    } catch (err) {
      alert("Error updating article");
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    try {
      await axios.delete(`http://localhost:5000/articles/${id}`);
      alert("Article deleted!");
      fetchArticles();
    } catch (err) {
      alert("Error deleting article");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>Articles App</h1>

      {mode === "list" && (
        <>
          <button onClick={() => setMode("create")}>Create New Article</button>
          <ul>
            {articles.map((a) => (
              <li key={a.id}>
                {a.title}{" "}
                <button onClick={() => handleView(a.id)}>View</button>
                <button onClick={() => handleEdit(a.id)}>Edit</button>
                <button onClick={() => handleDelete(a.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {mode === "view" && selectedArticle && (
        <>
          <button onClick={() => setMode("list")}>Back</button>
          <h2>{selectedArticle.title}</h2>
          <div
            dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
          ></div>
        </>
      )}

      {(mode === "create" || mode === "edit") && (
        <>
          <button onClick={() => setMode("list")}>Back</button>
          <h2>{mode === "create" ? "Create" : "Edit"} Article</h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              fontSize: "16px",
            }}
          />
          <ReactQuill value={content} onChange={setContent} />
          <button
            onClick={mode === "create" ? handleSubmit : handleUpdate}
            style={{ marginTop: "10px", padding: "10px" }}
          >
            {mode === "create" ? "Submit" : "Update"}
          </button>
        </>
      )}
    </div>
  );
}

export default App;
