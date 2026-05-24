import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  wishlist: string[];
  login: (identifier: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  toggleWishlist: (flowerId: string) => Promise<void>;
  updateUser: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserProfile(parsedUser.token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setWishlist(data.data.wishlist.map((f: any) => f._id || f));
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier: string, password: string) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        identifier,
        password,
      });
      if (data.success) {
        setUser(data.data);
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        fetchUserProfile(data.data.token);
      }
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData: any) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, userData);
      if (data.success) {
        setUser(data.data);
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        setWishlist([]);
      }
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setWishlist([]);
    localStorage.removeItem('userInfo');
  };

  const toggleWishlist = async (flowerId: string) => {
    if (!user) return;
    const isLiked = wishlist.includes(flowerId);
    try {
      if (isLiked) {
        await axios.delete(`${API_URL}/users/wishlist/${flowerId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setWishlist(prev => prev.filter(id => id !== flowerId));
      } else {
        await axios.post(`${API_URL}/users/wishlist/${flowerId}`, {}, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setWishlist(prev => [...prev, flowerId]);
      }
    } catch (error) {
      console.error("Wishlist toggle failed", error);
    }
  };

  const updateUser = (userData: any) => {
    const updatedUser = { ...user, ...userData, token: user?.token };
    setUser(updatedUser);
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, wishlist, login, register, logout, toggleWishlist, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
