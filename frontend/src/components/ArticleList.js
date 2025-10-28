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

  return (
    <div>
      <h2>All Articles</h2>
      {articles.length === 0 ? (
        <p>No articles yet.</p>
      ) : (
        <ul>
          {articles.map(a => (
            <li key={a.id}>
              <Link to={`/article/${a.id}`}>{a.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ArticleList;
