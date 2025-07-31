import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div className="font-bold">🛒 MyShop</div>
      <div>
        {isAuthenticated ? (
          <>
            <button onClick={logout} className="px-4 py-1 bg-red-500 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4">Login</Link>
            <Link to="/register" className="px-4">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
