import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On initial load, check if the user has a valid session (cookie)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Updated to match your backend route: /auth/currentUser
        const response = await api.get('/auth/currentUser'); 
        // Your backend uses ApiResponse structure: response.data.data.user
        setUser(response.data.data?.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);


  {/*login function which takes the email and password and gives the response data
    if the res is valid ---> navigate(dashboard) else throw the errror that login is failed.
    api.post('/auth/login')-----> send a http post request to the backend */}

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      setUser(response.data.data?.user);
      if (response.data.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
      }
      navigate("/dashboard");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (name, email, password) => {
    try {
      // Backend expects username, email, password. fullName is optional.
      // We will remove spaces for the username and pass the original name as fullName
      const formattedUsername = name.trim().replace(/\s+/g, '').toLowerCase() || email.split('@')[0];
      
      {/*register the user first*/}

      await api.post('/auth/register', { 
        username: formattedUsername, 
        email, 
        password,
        fullName: name 
      });
      
      {/*auto-login after registration to get a valid accessToken,
        because the register endpoint doesn't return tokens*/}
      await login(email, password);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Error logging out", error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      navigate("/");
    }
  };


  {/* these are the functions which the auth provider provides */}
  {/* these funciton take values and return the response */}

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
