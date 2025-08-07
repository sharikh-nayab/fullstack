import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert
} from 'react-bootstrap';

function ProductList() {
  const [products, setProducts] = useState([]);
  const { token, isAuthenticated } = useAuth();
  const [message, setMessage] = useState("");
  const [buyMessage, setBuyMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch('/api/products')
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const handleAddToWishlist = async (productId) => {
    try {
      const response = await fetch("http://localhost:5000/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Added to wishlist!");
      } else {
        setMessage(data.error || "Failed to add to wishlist.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }

    setTimeout(() => setMessage(""), 2000);
  };

  const handleBuyProduct = async (productId) => {
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
        setBuyMessage("✅ Purchase successful!");
        navigate("/orders");
      } else {
        setBuyMessage(data.error || "Purchase failed");
      }
    } catch (err) {
      console.error(err);
      setBuyMessage("Server error");
    }

    setTimeout(() => setBuyMessage(""), 2000);
  };

  return (
    <Container className="my-4">
      {message && <Alert variant="success">{message}</Alert>}
      {buyMessage && <Alert variant="info">{buyMessage}</Alert>}

      <Row xs={1} md={2} lg={3} className="g-4">
        {products.map(product => (
          <Col key={product.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  ₹{product.price}
                </Card.Subtitle>
                <Card.Text>{product.description}</Card.Text>

                <div className="d-flex justify-content-between">
                  <Link to={`/edit/${product.id}`} className="btn btn-outline-primary btn-sm">
                    Edit
                  </Link>
                  <Link to={`/delete/${product.id}`} className="btn btn-outline-danger btn-sm">
                    Delete
                  </Link>
                </div>

                {isAuthenticated && (
                  <div className="mt-3 d-flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddToWishlist(product.id)}
                    >
                      Add to Wishlist
                    </Button>

                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleBuyProduct(product.id)}
                    >
                      Buy Now
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ProductList;
