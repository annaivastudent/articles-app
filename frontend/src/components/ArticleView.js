import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ArticleView() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/articles/${id}`)
      .then(res => setArticle(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!article) return <p>Loading...</p>;

  return (
    <div>
      <h2>{article.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
}

export default ArticleView;
