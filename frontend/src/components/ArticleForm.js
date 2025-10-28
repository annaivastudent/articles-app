import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function ArticleForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5000/articles", { title, content })
      .then(() => {
        alert("Article saved!");
        setTitle("");
        setContent("");
      })
      .catch(err => alert("Error saving article: " + err.message));
  };

  return (
    <div>
      <h2>New Article</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Article title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <ReactQuill theme="snow" value={content} onChange={setContent} />
        <button type="submit" style={{ marginTop: "10px" }}>Save</button>
      </form>
    </div>
  );
}

export default ArticleForm;
