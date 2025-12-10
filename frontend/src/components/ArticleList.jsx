import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ArticleList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/articles")
      .then(res => setArticles(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await axios.delete(`http://localhost:5000/articles/${id}`);
      setArticles(articles.filter(a => a.id !== id));
    } catch (err) {
      alert("Error deleting article");
    }
  };

  return (
    <div>
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
