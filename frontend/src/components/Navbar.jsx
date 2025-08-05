import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage =
    location.pathname === "/auth/login" || location.pathname === "/auth/register";
  const isDashboard = location.pathname === "/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  if (isDashboard) return null;

  return (
    <nav className="w-full px-4 py-4 flex justify-center">
      <div className="w-full max-w-7xl bg-white text-black rounded-full px-6 py-3 shadow-lg flex items-center justify-between">
        {/* Left logo */}
        <div className="text-xl font-bold flex items-center gap-2">
          <span role="img" aria-label="logo">🛒</span> MyShop
        </div>

        {/* Center nav links with fixed spacing */}
        {isAuthenticated && (
          <div className="grid grid-flow-col auto-cols-max gap-[40px] text-sm font-medium">
            <Link to="/dashboard" className="hover:text-blue-500">Dashboard</Link>
            <Link to="/products" className="hover:text-blue-500">Products</Link>
            <Link to="/add" className="hover:text-blue-500">Add</Link>
            <Link to="/wishlist" className="hover:text-blue-500">Wishlist</Link>
            <Link to="/buy" className="hover:text-blue-500">Orders</Link>
            <Link to="/invoices" className="hover:text-blue-500">Invoices</Link>
            <Link to="/auth/users" className="hover:text-blue-500">Users</Link>
          </div>
        )}

        {/* Right-side auth buttons */}
        <div className="flex items-center gap-3">
          {!isAuthenticated && isAuthPage && (
            <>
              <Link
                to="/auth/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-full text-sm"
              >
                Register
              </Link>
            </>
          )}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-1.5 rounded-full hover:bg-gray-800 text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
