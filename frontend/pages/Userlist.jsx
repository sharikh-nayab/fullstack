import { useEffect, useState } from 'react';
import { apiFetch } from '../src/utils/api';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
  console.log("🔥 UserList mounted");

  const token = localStorage.getItem("jwt");
  if (!token) {
    setError("Please login first.");
    return;
  }

  apiFetch('/auth/users')
    .then(setUsers)
    .catch(e => setError(e.message));
}, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <ul>
      {users.map(u => (
        <li key={u.id}>
          {u.username} &lt;{u.email}&gt;
        </li>
      ))}
    </ul>
  );
}
