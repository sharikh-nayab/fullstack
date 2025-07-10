import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  return (
    <div>
      {products.map((product) => (
        <div key={product.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <h3>{product.name} – ${product.price}</h3>
          <p>{product.description}</p>
          <Link to={`/edit/${product.id}`} style={{ marginRight: '1rem' }}>Edit</Link>
          <Link to={`/delete/${product.id}`}>Delete</Link>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
