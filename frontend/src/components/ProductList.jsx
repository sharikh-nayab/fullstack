import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

function ProductList() {
  const [products, setProducts] = useState([]);
  const { token, isAuthenticated } = useAuth();
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiFetch('/api/products')
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const handleAddToWishlist = async (productId) => {
    try {
      const response = await fetch("http://localhost:5000/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Added to wishlist!");
      } else {
        setMessage(data.error || "Failed to add to wishlist.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }

    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div>
      {message && (
        <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">
          {message}
        </div>
      )}

      {products.map((product) => (
        <div
          key={product.id}
          style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}
        >
          <h3>{product.name} – ${product.price}</h3>
          <p>{product.description}</p>
          <Link to={`/edit/${product.id}`} style={{ marginRight: '1rem' }}>Edit</Link>
          <Link to={`/delete/${product.id}`}>Delete</Link>

          {isAuthenticated && (
            <button
              onClick={() => handleAddToWishlist(product.id)}
              className="ml-4 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add to Wishlist
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProductList;
