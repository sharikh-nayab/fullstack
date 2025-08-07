import { useEffect, useState } from "react";
import { useAuth } from "../src/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert
} from "react-bootstrap";

function Wishlist() {
  const { token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch("http://localhost:5000/wishlist", {
        headers: { Authorization: `Bearer ${token}` }
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
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
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

  const handleBuyNow = async (productId) => {
    try {
      const response = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Product purchased and invoice generated!");
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
        setTimeout(() => navigate("/orders"), 1000);
      } else {
        setError(data.error || "Failed to buy product");
      }
    } catch (err) {
      console.error(err);
      setError("Error processing purchase");
    }

    setTimeout(() => {
      setError("");
      setMessage("");
    }, 3000);
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">My Wishlist</h2>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {wishlistItems.length === 0 ? (
        <p className="text-muted text-center">Your wishlist is empty.</p>
      ) : (
        <Row className="g-4">
          {wishlistItems.map(item => (
            <Col md={6} lg={4} key={item.id}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Card.Text className="text-success fw-bold">
                    ₹{item.price}
                  </Card.Text>
                  <div className="d-flex gap-2">
                    <Button variant="danger" onClick={() => handleRemove(item.id)}>
                      ❌ Remove
                    </Button>
                    <Button variant="primary" onClick={() => handleBuyNow(item.id)}>
                      🛒 Buy Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Wishlist;
