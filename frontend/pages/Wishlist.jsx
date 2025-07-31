import { useEffect, useState } from "react";
import { useAuth } from "../src/context/AuthContext";

function Wishlist() {
  const { token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchWishlist();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {wishlistItems.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <ul className="space-y-2">
          {wishlistItems.map((item) => (
            <li key={item.id} className="p-4 border rounded shadow">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-600">{item.description}</p>
              <p className="text-green-600 font-bold">₹{item.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Wishlist;
