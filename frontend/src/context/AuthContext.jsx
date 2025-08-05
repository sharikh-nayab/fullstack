import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("jwt"));
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem("jwt");
    return storedToken ? jwtDecode(storedToken) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // ⏰ Check token expiration
  const checkTokenExpiration = () => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // in seconds

      if (decoded.exp && decoded.exp < currentTime) {
        toast.error("Session expired. Please log in again.");
        logout();
      }
    } catch (err) {
      console.error("Token decode error:", err);
      logout();
    }
  };

  // 🚀 Run on mount and every minute
  useEffect(() => {
    checkTokenExpiration();

    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // every 60 seconds

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Token decode error:", err);
        logout();
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("jwt", newToken);
    setToken(newToken);
    toast.success("Login successful!");
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
