import { useEffect, useState } from "react";
import { useAuth } from "../src/context/AuthContext";

function Invoices() {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch("http://localhost:5000/invoices", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setInvoices(data.invoices);
        else setError(data.error || "Failed to load invoices.");
      } catch (err) {
        console.error(err);
        setError("Error fetching invoices.");
      }
    };
    fetchInvoices();
  }, [token]);

  const handleDownload = async (invoiceId) => {
    try {
      setDownloadingId(invoiceId);
      const res = await fetch(`http://localhost:5000/invoice/${invoiceId}/pdf`); // ❌ No token here

      if (!res.ok) {
        let msg = "Failed to download invoice";
        try {
          const body = await res.json();
          msg = body.error || body.message || msg;
        } catch {}
        throw new Error(msg);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setError(e.message || "Download error");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Invoices</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {invoices.length === 0 ? (
        <p className="text-gray-500">No invoices generated yet.</p>
      ) : (
        <ul className="space-y-4">
          {invoices.map((inv) => (
            <li key={inv.invoice_id} className="p-4 border rounded shadow bg-white">
              <h2 className="text-lg font-semibold">{inv.product_name}</h2>
              <p className="text-gray-600">Total: ₹{inv.price}</p>
              <p className="text-sm text-gray-500">
                Issued on: {new Date(inv.generated_at).toLocaleString()}
              </p>
              <button
                onClick={() => handleDownload(inv.invoice_id)}
                className="inline-block mt-2 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                disabled={downloadingId === inv.invoice_id}
              >
                {downloadingId === inv.invoice_id ? "Downloading..." : "Download PDF"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Invoices;
