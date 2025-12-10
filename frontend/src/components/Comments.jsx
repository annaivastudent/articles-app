import React, { useEffect, useState } from "react";
import axios from "axios";

const Comments = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/comments/${articleId}`)
      .then(res => setComments(res.data))
      .catch(err => console.error(err));
  }, [articleId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/comments/${articleId}/comments`, {
        content: newComment,
      });
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/comments/${id}`);
      setComments(comments.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {comments.map(c => (
          <li key={c.id}>
            {c.content}
            <button onClick={() => handleDeleteComment(c.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default Comments;
