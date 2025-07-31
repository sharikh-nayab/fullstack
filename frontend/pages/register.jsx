// pages/register.jsx
import { useState } from 'react';

export default function Register() {
  const [username, setUsername]     = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [message, setMessage]       = useState('');
  const [error, setError]           = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); 
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error || 'Registration failed');
      }

      // Success: show a message but stay on this page
      setMessage(body.message || 'Registered successfully! You can now log in.');
      // Optionally clear the form
      setUsername('');
      setEmail('');
      setPassword('');
    }
    catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>

      {/* Success message */}
      {message && (
        <div style={{ padding: '1em', background: '#def', marginBottom: '1em' }}>
          {message}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div style={{ padding: '1em', background: '#fdd', marginBottom: '1em' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
