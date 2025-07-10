import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function DeleteProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error("Error fetching product:", err));
  }, [id]);

  const handleDelete = () => {
    fetch(`http://127.0.0.1:5000/api/products/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        return res.json();
      })
      .then(data => {
        setMessage(data.message);
        setTimeout(() => navigate('/products'), 1000);
      })
      .catch(err => {
        console.error(err);
        setMessage("Failed to delete product");
      });
  };

  return (
    <div>
      <h2>Delete Product</h2>
      {product && (
        <p>Are you sure you want to delete <strong>{product.name}</strong>?</p>
      )}
      <button onClick={handleDelete}>Yes, Delete</button>
      <button onClick={() => navigate('/products')}>Cancel</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default DeleteProduct;
