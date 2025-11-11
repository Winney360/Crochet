import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ FIX: Use the same keys as AdminLogin.js
    const token = localStorage.getItem('adminToken');        // Changed from 'token'
    const adminData = localStorage.getItem('adminData');     // Changed from 'admin'
    
    if (token && adminData) {
      // Set default authorization header for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      setAdmin(JSON.parse(adminData));
    }
    setLoading(false);
  }, []);

  const login = (token, adminData) => {
    // ✅ FIX: Use consistent keys
    localStorage.setItem('adminToken', token);                // Changed from 'token'
    localStorage.setItem('adminData', JSON.stringify(adminData)); // Changed from 'admin'
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
    setAdmin(adminData);
  };

  const logout = () => {
    // ✅ FIX: Remove the correct keys
    localStorage.removeItem('adminToken');                    // Changed from 'token'
    localStorage.removeItem('adminData');                    // Changed from 'admin'
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setAdmin(null);
  };

  const value = {
    isAuthenticated,
    admin,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};