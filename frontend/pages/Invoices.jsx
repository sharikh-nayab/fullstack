import { useEffect, useState } from "react";
import { useAuth } from "../src/context/AuthContext";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner
} from "react-bootstrap";

export default function Invoices() {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch("http://localhost:5000/invoices", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setInvoices(data.invoices);
        } else {
          throw new Error(data.error || "Failed to load invoices.");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, [token]);

  const handleDownload = async (invoiceId) => {
    setError("");
    setDownloadingId(invoiceId);
    try {
      const res = await fetch(
        `http://localhost:5000/invoices/${invoiceId}/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Download failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">My Invoices</h2>
      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && invoices.length === 0 && (
        <Alert variant="info">No invoices generated yet.</Alert>
      )}

      <Row className="g-4">
        {invoices.map((inv) => (
          <Col key={inv.invoice_id} md={6} lg={4}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>{inv.product_name}</Card.Title>
                <Card.Text>Total: ₹{inv.price}</Card.Text>
                <Card.Text className="text-muted">
                  Issued on:{" "}
                  {new Date(inv.generated_at).toLocaleString()}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => handleDownload(inv.invoice_id)}
                  disabled={downloadingId === inv.invoice_id}
                  className="mt-2"
                >
                  {downloadingId === inv.invoice_id
                    ? "Downloading..."
                    : "Download PDF"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
