import { Routes, Route, Link } from 'react-router-dom';
import Home from '../pages/Home';
import Products from '../pages/Products';
import Add from '../pages/Add';
import EditProduct from '../pages/EditProduct';
import DeleteProduct from '../pages/DeleteProduct';

function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/products" style={{ marginRight: '1rem' }}>Products</Link>
        <Link to="/add">Add Product</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/add" element={<Add />} />
        <Route path="/edit/:id" element={<EditProduct />} />
        <Route path="/delete/:id" element={<DeleteProduct />} />
      </Routes>
    </div>
  );
}

export default App;
