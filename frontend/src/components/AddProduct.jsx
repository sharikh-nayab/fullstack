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
    <div className="grid gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded shadow-sm p-4 bg-white space-y-2"
        >
          <h3 className="text-lg font-semibold">
            {product.name} – ${product.price}
          </h3>
          <p className="text-gray-700">{product.description}</p>
          <div className="flex gap-4">
            <Link
              to={`/edit/${product.id}`}
              className="text-blue-600 hover:underline"
            >
              Edit
            </Link>
            <Link
              to={`/delete/${product.id}`}
              className="text-red-600 hover:underline"
            >
              Delete
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
