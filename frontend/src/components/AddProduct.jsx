import { useState } from 'react';

function AddProduct({ onProductAdded }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload

    // prepare data to send
    const newProduct = {
      name,
      price: parseFloat(price),
      description
    };

    fetch('http://127.0.0.1:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to add product");
        }
        return res.json();
      })
      .then(data => {
        setMessage(data.message);   // success message from backend
        setName('');
        setPrice('');
        setDescription('');
        if (onProductAdded) onProductAdded(); // optional callback to refresh list
      })
      .catch(err => {
        console.error(err);
        setMessage('Error adding product');
      });
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2>Add New Product</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label><br />
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Price:</label><br />
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label><br />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
