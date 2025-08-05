import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold mb-2">Welcome to the Dashboard</h1>
        <p className="text-lg text-gray-400">
          Manage everything in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-10 pb-10">
        <Link
          to="/products"
          className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg text-center shadow-md transition"
        >
          View Products
        </Link>
        <Link
          to="/add"
          className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg text-center shadow-md transition"
        >
          Add Product
        </Link>
        <Link
          to="/wishlist"
          className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg text-center shadow-md transition"
        >
          My Wishlist
        </Link>
        <Link
          to="/buy"
          className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg text-center shadow-md transition"
        >
          My Orders
        </Link>
        <Link
          to="/invoices"
          className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg text-center shadow-md transition"
        >
          Invoices
        </Link>
        <Link
          to="/auth/users"
          className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg text-center shadow-md transition"
        >
          Users
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
