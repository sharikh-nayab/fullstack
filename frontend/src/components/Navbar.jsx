import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

function AppNavbar() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage =
    location.pathname === "/auth/login" || location.pathname === "/auth/register";
  const isDashboard = location.pathname === "/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  if (isDashboard) return null;

  return (
    <Navbar bg="dark" expand="lg" className="shadow-sm mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          🛒 MyShop
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          {isAuthenticated && (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/products">Products</Nav.Link>
              <Nav.Link as={Link} to="/add">Add</Nav.Link>
              <Nav.Link as={Link} to="/wishlist">Wishlist</Nav.Link>
              <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
              <Nav.Link as={Link} to="/invoices">Invoices</Nav.Link>
              <Nav.Link as={Link} to="/auth/users">Users</Nav.Link>
            </Nav>
          )}

          <Nav className="ms-auto d-flex align-items-center gap-3">
            {!isAuthenticated && isAuthPage && (
              <>
                <Button variant="primary" as={Link} to="/auth/login">
                  Login
                </Button>
                <Button variant="success" as={Link} to="/auth/register">
                  Register
                </Button>
              </>
            )}
            {isAuthenticated && (
              <Button variant="dark" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
