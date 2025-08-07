import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import Home from '../pages/Home';
import Products from '../pages/Products';
import Add from '../pages/Add';
import EditProduct from '../pages/EditProduct';
import DeleteProduct from '../pages/DeleteProduct';
import Login from '../pages/login';
import Register from '../pages/register';
import Users from '../pages/Userlist';
import Wishlist from '../pages/Wishlist';
import ProtectedRoute from '../pages/ProtectedRoute';
import BuyProduct from '../pages/BuyProduct';
import Invoices from '../pages/invoices';
import Dashboard from '../pages/Dashboard';
import AppNavbar from '../src/components/Navbar';

function App() {
  return (
    <>
      <AppNavbar />
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* ✅ Removed the Tailwind-style className wrapper */}
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" />} />
        <Route path="/health" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/add" element={<ProtectedRoute><Add /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
        <Route path="/delete/:id" element={<ProtectedRoute><DeleteProduct /></ProtectedRoute>} />
        <Route path="/auth/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><BuyProduct /></ProtectedRoute>} />
        <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
