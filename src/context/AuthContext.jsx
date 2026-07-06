import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('hms_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: replace with real endpoint once backend is ready
      // const { data } = await api.post('/auth/login', credentials);
      await new Promise((r) => setTimeout(r, 700));
      const mockUser = { name: 'Dr. Aisha Verma', role: 'Administrator', email: credentials.email };
      const mockToken = 'mock-jwt-token';

      localStorage.setItem('hms_token', mockToken);
      localStorage.setItem('hms_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('hms_token');
    localStorage.removeItem('hms_user');
    setUser(null);
  }, []);

  const value = { user, loading, error, login, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
