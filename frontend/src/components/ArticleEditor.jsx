import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function ArticleEditor({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceId, setWorkspaceId] = useState("");

  useEffect(() => {
    if (mode === "edit" && id) {
      axios
        .get(`http://localhost:5000/articles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
          setTitle(res.data.title);
          setContent(res.data.content);
          setWorkspaceId(res.data.workspaceId || "");
        })
        .catch(err => {
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
          }
        });
    }

    axios
      .get("http://localhost:5000/workspaces", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setWorkspaces(res.data))
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      });
  }, [mode, id, navigate, token]);

  const handleSubmit = async () => {
    if (!title || !content) return alert("Title and content required!");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (file) formData.append("attachment", file);
    if (workspaceId) formData.append("workspaceId", workspaceId);

    try {
      if (mode === "create") {
        await axios.post("http://localhost:5000/articles", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.put(`http://localhost:5000/articles/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      navigate("/");
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Error saving article");
      }
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/")}>Back</button>
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

      <select
        value={workspaceId}
        onChange={(e) => setWorkspaceId(e.target.value)}
        style={{ marginTop: "10px", padding: "5px", width: "100%" }}
      >
        <option value="">Select workspace</option>
        {workspaces.map(ws => (
          <option key={ws.id} value={ws.id}>{ws.name}</option>
        ))}
      </select>

      <button
        onClick={handleSubmit}
        style={{ marginTop: "10px", padding: "10px" }}
      >
        {mode === "create" ? "Submit" : "Update"}
      </button>
    </div>
  );
}

export default ArticleEditor;
