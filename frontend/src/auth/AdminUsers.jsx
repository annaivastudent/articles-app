import { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // загрузка списка пользователей
  useEffect(() => {
    fetch("http://localhost:5000/users", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setUsers(data);
      })
      .catch(() => setError("Failed to fetch users"));
  }, []);

  // смена роли
  const updateRole = async (id, role) => {
    try {
      const res = await fetch(`http://localhost:5000/users/${id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ role })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update role");
        return;
      }

      // обновляем локально
      setUsers(users.map(u => (u.id === id ? { ...u, role } : u)));
    } catch {
      setError("Failed to update role");
    }
  };

  return (
    <div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {users.map(user => (
        <div key={user.id} style={{ marginBottom: "10px" }}>
          <strong>{user.email}</strong> — {user.role}
          <select
            value={user.role}
            onChange={(e) => updateRole(user.id, e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>
      ))}
    </div>
  );
}
