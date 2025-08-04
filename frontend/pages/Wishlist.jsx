import { useEffect, useState } from "react";
import { useAuth } from "../src/context/AuthContext";

function Wishlist() {
  const { token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchWishlist = async () => {
    try {
      const response = await fetch("http://localhost:5000/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setWishlistItems(data.wishlist);
      } else {
        setError(data.error || "Failed to load wishlist");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching wishlist");
    }
  };

  const handleRemove = async (productId) => {
    try {
      const response = await fetch("http://localhost:5000/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Removed from wishlist");
        // Remove item from local state instantly
        setWishlistItems(wishlistItems.filter(item => item.id !== productId));
      } else {
        setError(data.error || "Failed to remove item");
      }
    } catch (err) {
      console.error(err);
      setError("Error removing item");
    }

    setTimeout(() => {
      setError("");
      setMessage("");
    }, 2000);
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>

      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {wishlistItems.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <ul className="space-y-2">
          {wishlistItems.map((item) => (
            <li key={item.id} className="p-4 border rounded shadow">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-600">{item.description}</p>
              <p className="text-green-600 font-bold">₹{item.price}</p>

              <button
                onClick={() => handleRemove(item.id)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 block"
              >
                 ❌ Remove
              </button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Wishlist;
