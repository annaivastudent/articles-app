import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [mode, setMode] = useState('list');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const res = await axios.get('http://localhost:5000/articles');
    setArticles(res.data);
  };

  const handleView = async (id) => {
    const res = await axios.get(`http://localhost:5000/articles/${id}`);
    setSelectedArticle(res.data);
    setMode('view');
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      alert('Title and content are required!');
      return;
    }
    await axios.post('http://localhost:5000/articles', { title, content });
    setTitle('');
    setContent('');
    fetchArticles();
    setMode('list');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>Articles App</h1>

      {mode === 'list' && (
        <>
          <button onClick={() => setMode('create')}>Create New Article</button>
          <ul>
            {articles.map((a) => (
              <li key={a.id}>
                {a.title}{' '}
                <button onClick={() => handleView(a.id)}>View</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {mode === 'view' && selectedArticle && (
        <>
          <button onClick={() => setMode('list')}>Back</button>
          <h2>{selectedArticle.title}</h2>
          <div
            dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
          ></div>
        </>
      )}

      {mode === 'create' && (
        <>
          <button onClick={() => setMode('list')}>Back</button>
          <h2>Create Article</h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              fontSize: '16px',
            }}
          />
          <ReactQuill value={content} onChange={setContent} />
          <button
            onClick={handleSubmit}
            style={{ marginTop: '10px', padding: '10px' }}
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
}

export default App;
