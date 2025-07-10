import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditProduct() {
  const { id } = useParams(); // extract ID from the URL
  const navigate = useNavigate(); // to redirect after update

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // fetch existing product data
    fetch(`http://127.0.0.1:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setName(data.name);
        setPrice(data.price);
        setDescription(data.description);
      })
      .catch(err => console.error("Error fetching product:", err));
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedProduct = {
      name,
      price: parseFloat(price),
      description
    };

    fetch(`http://127.0.0.1:5000/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedProduct)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update');
        return res.json();
      })
      .then(data => {
        setMessage(data.message);
        setTimeout(() => navigate('/products'), 1000); // go back to products page
      })
      .catch(err => {
        console.error(err);
        setMessage('Error updating product');
      });
  };

  return (
    <div>
      <h2>Edit Product</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleUpdate}>
        <label>Name:</label><br />
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required /><br />
        <label>Price:</label><br />
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required /><br />
        <label>Description:</label><br />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} /><br />
        <button type="submit">Update Product</button>
      </form>
    </div>
  );
}

export default EditProduct;
