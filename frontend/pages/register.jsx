// pages/register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername]     = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [message, setMessage]       = useState('');
  const [error, setError]           = useState('');
  const navigate = useNavigate();

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

      // ✅ Success
      setMessage(body.message || 'Registered successfully! Redirecting to login...');
      setUsername('');
      setEmail('');
      setPassword('');

      // ✅ Optionally auto-redirect after 2 seconds
      setTimeout(() => navigate('/auth/login'), 2000);
    }
    catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {/* ✅ Success message */}
      {message && (
        <div className="p-3 bg-blue-100 text-blue-800 rounded mb-3">
          {message}
        </div>
      )}

      {/* ❌ Error message */}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>

      {/* 👇 Manual login button as fallback */}
      <div className="mt-4 text-center">
        <p className="text-sm text-blue-600">Already have an account?</p>
        <button
          onClick={() => navigate('/auth/login')}
          className="mt-1 text-blue-600 hover:underline"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
