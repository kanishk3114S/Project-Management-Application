import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock checking if user was already logged in (e.g., from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("mock_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // MOCK LOGIN
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const mockUser = { id: 1, name: "Test User", email, role: "admin" };
          setUser(mockUser);
          localStorage.setItem("mock_user", JSON.stringify(mockUser));
          resolve(mockUser);
          navigate("/dashboard");
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 1000); // simulate network delay
    });
  };

  const register = async (name, email, password) => {
    // MOCK REGISTER
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          const mockUser = { id: 1, name, email, role: "admin" };
          setUser(mockUser);
          localStorage.setItem("mock_user", JSON.stringify(mockUser));
          resolve(mockUser);
          navigate("/dashboard");
        } else {
          reject(new Error("All fields are required"));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mock_user");
    navigate("/");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
