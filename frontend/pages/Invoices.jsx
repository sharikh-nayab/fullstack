import { useEffect, useState } from "react";
import { useAuth } from "../src/context/AuthContext";

function Invoices() {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://localhost:5000/invoices", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setInvoices(data.invoices);
        } else {
          setError(data.error || "Failed to load invoices.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching invoices.");
      }
    };

    fetchInvoices();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Invoices</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {invoices.length === 0 ? (
        <p className="text-gray-500">No invoices generated yet.</p>
      ) : (
        <ul className="space-y-4">
          {invoices.map((invoice) => (
            <li
              key={invoice.invoice_id}
              className="p-4 border rounded shadow bg-white"
            >
              <h2 className="text-lg font-semibold">{invoice.product_name}</h2>
              <p className="text-gray-600">Total: ₹{invoice.price}</p>
              <p className="text-sm text-gray-500">
                Issued on: {new Date(invoice.generated_at).toLocaleString()}
              </p>
              <a
                href={`http://localhost:5000/invoice/${invoice.invoice_id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-600 hover:underline"
              >
                Download PDF
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Invoices;
