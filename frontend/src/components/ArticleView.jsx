import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ArticleView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [versions, setVersions] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/articles/${id}`)
      .then(res => {
        setArticle(res.data);
        setCurrentVersion(res.data.version || 0);
      })
      .catch(err => console.error("Ошибка загрузки статьи:", err));
  }, [id]);

  const loadVersions = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/articles/${id}/versions`);
      setVersions(res.data);
    } catch (err) {
      console.error("Ошибка загрузки версий:", err);
    }
  };

  const isLatestVersion = currentVersion === Math.max(0, ...versions.map(v => v.version));

  return (
    <div>
      {article ? (
        <>
          <h2>{article.title}</h2>
          <p>{article.content.replace(/<[^>]+>/g, "")}</p>

          {/* Отображение картинки */}
          {article.attachment && (
            <img
              src={`http://localhost:5000${article.attachment}`}
              alt="attachment"
              style={{ maxWidth: "400px", marginTop: "10px", border: "1px solid #ccc" }}
            />
          )}

          <p style={{ fontStyle: "italic", color: "#666" }}>
            Текущая версия: {currentVersion || "оригинал"}
          </p>

          {/* Баннер для старых версий */}
          {!isLatestVersion && (
            <div style={{ background: "#ffe0e0", padding: "10px", margin: "10px 0" }}>
              Вы просматриваете старую версию. Редактирование недоступно.
            </div>
          )}

          {/* Кнопка «Редактировать» только для оригинала и последней версии */}
          {isLatestVersion && !article.articleId && (
            <button onClick={() => navigate(`/edit/${article.id}`)}>Редактировать</button>
          )}

          <button onClick={loadVersions}>Версии</button>

          {versions.length > 0 ? (
            <ul>
              {versions.map(v => (
                <li key={v.id}>
                  <button onClick={() => {
                    setArticle(v);
                    setCurrentVersion(v.version);
                  }}>
                    Версия {v.version}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>У этой статьи пока нет версий.</p>
          )}
        </>
      ) : (
        <p>Статья не найдена или произошла ошибка.</p>
      )}
    </div>
  );
}

export default ArticleView;
