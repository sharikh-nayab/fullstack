import { useEffect, useState } from "react";
import { useAuth } from "../src/context/AuthContext";

function BuyProduct() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/orders", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setOrders(data.orders);
        } else {
          setError(data.error || "Failed to load orders.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching orders.");
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {error && <p className="text-red-600">{error}</p>}

      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't purchased anything yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order, index) => (
            <li key={index} className="p-4 border rounded shadow">
              <h2 className="text-lg font-semibold">{order.name}</h2>
              <p className="text-gray-600">{order.description}</p>
              <p className="text-green-600 font-bold">₹{order.price}</p>
              <p className="text-sm text-gray-500">
                Ordered at: {new Date(order.ordered_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BuyProduct;
