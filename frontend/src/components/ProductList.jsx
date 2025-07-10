import { useEffect, useState } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);  // hold product list

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/products')  // call your backend
      .then(res => res.json())                   // convert response to JSON
      .then(data => setProducts(data))           // save data into state
      .catch(err => console.error("Error:", err));
  }, []);  // run once when page loads

  return (
    <div>
      <h2>All Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <strong>{product.name}</strong> – ${product.price}
              <br />
              {product.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductList;
