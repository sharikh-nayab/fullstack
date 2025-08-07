import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";

function Dashboard() {
  const items = [
    { to: "/products", label: "View Products" },
    { to: "/add", label: "Add Product" },
    { to: "/wishlist", label: "My Wishlist" },
    { to: "/orders", label: "My Orders" },
    { to: "/invoices", label: "Invoices" },
    { to: "/auth/users", label: "Users" },
  ];

  return (
    <Container className="my-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Welcome to the Dashboard</h1>
        <p className="text-muted">Manage everything in one place.</p>
      </div>

      <Row className="g-4">
        {items.map((item, idx) => (
          <Col md={4} key={idx}>
            <Card
              as={Link}
              to={item.to}
              className="text-center text-decoration-none shadow-sm h-100"
            >
              <Card.Body className="p-4 bg-dark text-white rounded">
                <Card.Title>{item.label}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Dashboard;
