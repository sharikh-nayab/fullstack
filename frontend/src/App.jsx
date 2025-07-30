import { Routes, Route, Link } from 'react-router-dom';
import Home from '../pages/Home';
import Products from '../pages/Products';
import Add from '../pages/Add';
import EditProduct from '../pages/EditProduct';
import DeleteProduct from '../pages/DeleteProduct';
import './index.css';
import Login from '../pages/login';


function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <nav className="bg-blue-600 text-white p-4 rounded flex gap-4 mb-6">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/products" className="hover:underline">Products</Link>
        <Link to="/add" className="hover:underline">Add Product</Link>
        <Link to="/auth/login" className="px-4 py-2">Login</Link>
      </nav>


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/add" element={<Add />} />
        <Route path="/edit/:id" element={<EditProduct />} />
        <Route path="/delete/:id" element={<DeleteProduct />} />
        <Route path="/auth/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
