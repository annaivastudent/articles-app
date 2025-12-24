import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/articles", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setArticles(res.data))
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      });
  }, [navigate, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article?")) return;

    try {
      await axios.delete(`http://localhost:5000/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setArticles(articles.filter(a => a.id !== id));
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Error deleting article");
      }
    }
  };

  return (
    <div>
      <a href="/logout" style={{ float: "right" }}>Logout</a>
      <Link to="/create"><button>Create New Article</button></Link>

      {articles.length === 0 ? (
        <p>No articles yet.</p>
      ) : (
        <ul>
          {articles.map(a => (
            <li key={a.id}>
              {a.title}{" "}
              <Link to={`/article/${a.id}`}><button>View</button></Link>
              <Link to={`/edit/${a.id}`}><button>Edit</button></Link>
              <button onClick={() => handleDelete(a.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ArticleList;
