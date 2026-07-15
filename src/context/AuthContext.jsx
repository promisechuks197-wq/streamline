import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem('auth_token');

  const apiCall = useCallback(async (path, options = {}) => {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const res = await fetch(`${API_URL}${path}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  }, []);

  const loadUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await apiCall('/api/auth/me');
      setUser(data.user);
    } catch {
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const data = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('auth_token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem('auth_token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const data = await apiCall('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    setUser(data.user);
    return data;
  };

  const changePassword = async (currentPassword, newPassword) => {
    const data = await apiCall('/api/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    localStorage.setItem('auth_token', data.token);
    setUser(data.user);
    return data;
  };

  const forgotPassword = async (email) => {
    return await apiCall('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  };

  const resetPassword = async (token, password) => {
    const data = await apiCall('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
    localStorage.setItem('auth_token', data.token);
    setUser(data.user);
    return data;
  };

  const handleGoogleCallback = (token) => {
    localStorage.setItem('auth_token', token);
    loadUser();
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      forgotPassword,
      resetPassword,
      handleGoogleCallback,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
