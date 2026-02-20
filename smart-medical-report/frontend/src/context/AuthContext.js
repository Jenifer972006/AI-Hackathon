import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('medai_token');
    const userData = localStorage.getItem('medai_user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await loginUser({ email, password });
    if (data.success) {
      localStorage.setItem('medai_token', data.token);
      localStorage.setItem('medai_user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    }
  };

  const register = async (userData) => {
    const { data } = await registerUser(userData);
    if (data.success) {
      localStorage.setItem('medai_token', data.token);
      localStorage.setItem('medai_user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    }
  };

  const logout = () => {
    localStorage.removeItem('medai_token');
    localStorage.removeItem('medai_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
