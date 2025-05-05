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