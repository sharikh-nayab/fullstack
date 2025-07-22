// components/AddProduct.jsx
import { useState } from 'react';

function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      name,
      price: parseFloat(price),
      description,
    };

    fetch('http://127.0.0.1:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to add product');
        return res.json();
      })
      .then((data) => {
        setMessage(data.message || 'Product added!');
        setName('');
        setPrice('');
        setDescription('');
      })
      .catch((err) => {
        console.error(err);
        setMessage('Error adding product');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
      {message && <p className="text-green-600">{message}</p>}
      
      <div>
        <label className="block font-semibold">Name:</label>
        <input
          className="w-full border px-3 py-2 rounded"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Price:</label>
        <input
          className="w-full border px-3 py-2 rounded"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Description:</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Product
      </button>
    </form>
  );
}

export default AddProduct;
