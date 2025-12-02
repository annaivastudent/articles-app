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
  const [file, setFile] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchArticles();

    const ws = new WebSocket("ws://localhost:5001");
    ws.onopen = () => console.log("WebSocket подключен");
    ws.onmessage = (event) => console.log("Сообщение от сервера:", event.data);
    ws.onerror = (err) => console.error("WebSocket ошибка", err);
    ws.onclose = () => console.log("WebSocket закрыт");
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setNotification(msg.message);
      setTimeout(() => setNotification(null), 4000);
    };
    return () => ws.close();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/articles");
      setArticles(res.data);
    } catch (err) {
      console.error("Error fetching articles:", err);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) return alert("Title and content required!");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (file) formData.append("attachment", file);

    try {
      await axios.post("http://localhost:5000/articles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTitle("");
      setContent("");
      setFile(null);
      fetchArticles();
      setMode("list");
    } catch {
      alert("Error creating article");
    }
  };

  const handleUpdate = async () => {
    if (!title || !content) return alert("Title and content required!");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (file) formData.append("attachment", file);

    try {
      await axios.put(`http://localhost:5000/articles/${selectedArticle.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTitle("");
      setContent("");
      setFile(null);
      fetchArticles();
      setMode("list");
    } catch {
      alert("Error updating article");
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/articles/${id}`);
      setSelectedArticle(res.data);
      setMode("view");
    } catch {
      alert("Error loading article");
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/articles/${id}`);
      setSelectedArticle(res.data);
      setTitle(res.data.title);
      setContent(res.data.content);
      setMode("edit");
    } catch {
      alert("Error loading article for editing");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    await axios.delete(`http://localhost:5000/articles/${id}`);
    fetchArticles();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>Articles App</h1>

      {notification && (
        <div style={{ background: "#d1ecf1", padding: 10, borderRadius: 5, marginBottom: 10 }}>
          {notification}
        </div>
      )}

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
          <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }}></div>

          {selectedArticle.attachment && (
  <>
    <h3>Attachment:</h3>
    {selectedArticle.attachment.endsWith(".pdf") ? (
      <a href={`http://localhost:5000${selectedArticle.attachment}`} target="_blank" rel="noreferrer">
        View PDF
      </a>
    ) : (
      <img src={`http://localhost:5000${selectedArticle.attachment}`} alt="attachment" width="200" />
    )}
  </>
)}

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
            style={{ width: "100%", padding: "10px", marginBottom: "10px", fontSize: "16px" }}
          />
          <ReactQuill value={content} onChange={setContent} />

          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginTop: "10px" }}
          />

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
