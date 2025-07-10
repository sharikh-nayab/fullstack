import { useEffect, useState } from 'react';
import ProductList from './components/ProductList';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/message')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('Error fetching message:', err));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>React + Flask Fullstack App</h1>
      <p style={{ color: 'gray', fontStyle: 'italic' }}>{message}</p>
      <hr style={{ margin: '1rem 0' }} />
      <ProductList />
    </div>
  );
}

export default App;
