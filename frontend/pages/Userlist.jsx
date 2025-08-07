import { useEffect, useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import {
  Container,
  Table,
  Spinner,
  Alert
} from 'react-bootstrap';

function UserList() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/auth/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setUsers(data.users || []);
      })
      .catch(err => setError(err.message || 'Error fetching users'))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">User List</h2>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && users.length === 0 && (
        <Alert variant="info">No users found.</Alert>
      )}

      {!loading && users.length > 0 && (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Registered At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={u.id}>
                <td>{idx + 1}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{new Date(u.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default UserList;
