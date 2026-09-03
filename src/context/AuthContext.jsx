import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await authService.getCurrentUser();
        if (res && res.data) {
          setUser(res.data);
        }
      } catch (err) {
        console.error('Failed to restore user session:', err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res && res.data) {
      setUser(res.data.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res && res.data) {
      setUser(res.data.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('vm_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
