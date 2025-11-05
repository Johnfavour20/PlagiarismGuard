
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await axios.get<{ user: User }>(`${API_URL}/auth/me`);
          setUser(response.data.user);
        } catch (error) {
          console.error('Load user error:', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const register = async (userData: any) => {
    try {
      const response = await axios.post<{ token: string; user: User }>(`${API_URL}/auth/register`, userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      toast.success('Registration successful!');
      return { success: true, user };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<{ token: string; user: User }>(`${API_URL}/auth/login`, { email, password });
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      toast.success(`Welcome back, ${user.name}!`);
      return { success: true, user };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.info('Logged out successfully');
  };

  const updateProfile = async (updates: any) => {
    try {
      const response = await axios.put<{ user: User }>(`${API_URL}/auth/profile`, updates);
      setUser(response.data.user);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await axios.put(`${API_URL}/auth/change-password`, { currentPassword, newPassword });
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLecturer: user?.role === 'lecturer',
    isStudent: user?.role === 'student'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
