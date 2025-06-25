import { createContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUserProfile as getCurrentUser } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await getCurrentUser(token);
        setUser(userData);
      }
    } catch (err) {
      localStorage.removeItem('token');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback((userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setError(null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUser,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};