import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser } from '../Service/UserService';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage on initial load
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);

    // Check for OAuth2 response in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      // Handle OAuth2 login success
      const userData = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
      const user = {
        id: userData.userId || userData.sub, // Use userId if available, fallback to sub
        email: userData.email,
        fullName: userData.name
      };
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      // Remove token from URL and redirect to home
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      const user = {
        id: response.userId,
        email,
        fullName: response.fullName
      };
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};