import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { User as UserIcon, Package, Heart, Lock, LogOut, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Order, Flower } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Spinner = () => (
  <div className="w-8 h-8 border-4 border-bloom-pink border-t-transparent rounded-full animate-spin mx-auto" />
);

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistFlowers, setWishlistFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'wishlist') fetchWishlist();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (data.success) setOrders(data.data);
    } catch (error) {
      console.error('Fetch orders failed', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (data.success) setWishlistFlowers(data.data.wishlist);
    } catch (error) {
      console.error('Fetch wishlist failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${API_URL}/users/profile`, profileData, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Update failed',
      });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    try {
      const { data } = await axios.put(
        `${API_URL}/users/password`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      if (data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Password change failed',
      });
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <UserIcon size={20} /> },
    { id: 'orders', label: 'My Orders', icon: <Package size={20} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={20} /> },
    { id: 'password', label: 'Security', icon: <Lock size={20} /> },
  ];

  return (
    <div className="pt-32 pb-24 px-6 bg-bloom-cream min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="glass p-8 rounded-[2rem] sticky top-32">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-bloom-green/10">
                <div className="w-16 h-16 rounded-full bg-bloom-pink/20 flex items-center justify-center text-bloom-pink text-2xl font-bold">
                  {user?.fullName?.charAt(0)}
                </div>
                <div>
                  <h2 className="font-cormorant font-bold text-xl text-bloom-green">
                    {user?.fullName}
                  </h2>
                  <p className="text-xs text-bloom-green/40">@{user?.username}</p>
                </div>
              </div>
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-bloom-green text-white shadow-lg shadow-bloom-green/20'
                        : 'text-bloom-green/60 hover:bg-white/40 hover:text-bloom-green'
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 hover:bg-red-50 transition-all mt-8"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:flex-1">
            <AnimatePresence mode="wait">

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass p-10 rounded-[2.5rem]"
                >
                  <h3 className="text-3xl font-cormorant font-bold text-bloom-green mb-8">
                    Personal Information
                  </h3>
                  {message.text && (
                    <div className={`mb-8 p-4 rounded-xl text-sm border ${
                      message.type === 'success'
                        ? 'bg-green-50 text-green-600 border-green-100'
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {message.text}
                    </div>
                  )}
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.fullName}
                          onChange={(e) =>
                            setProfileData({ ...profileData, fullName: e.target.value })
                          }
                          className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/10 focus:ring-2 focus:ring-bloom-green/20 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4">
                          Username
                        </label>
                        <input
                          type="text"
                          value={profileData.username}
                          onChange={(e) =>
                            setProfileData({ ...profileData, username: e.target.value })
                          }
                          className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/10 focus:ring-2 focus:ring-bloom-green/20 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({ ...profileData, email: e.target.value })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/10 focus:ring-2 focus:ring-bloom-green/20 outline-none"
                      />
                    </div>
                    <button className="bg-bloom-green text-white px-10 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-bloom-green/20">
                      Update Profile
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-3xl font-cormorant font-bold text-bloom-green mb-8">
                    Order History
                  </h3>
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Spinner />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="glass p-12 rounded-[2.5rem] text-center">
                      <Package size={48} className="mx-auto text-bloom-green/20 mb-4" />
                      <p className="text-bloom-green/60">You have not placed any orders yet.</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order._id}
                        className="glass p-8 rounded-[2rem] flex flex-col md:flex-row justify-between gap-8"
                      >
                        <div className="flex gap-6">
                          <div className="flex -space-x-4">
                            {order.items.slice(0, 3).map((item, i) => (
                              <img
                                key={i}
                                src={item.flower?.image}
                                className="w-16 h-16 rounded-xl border-2 border-white object-cover"
                                alt="flower"
                              />
                            ))}
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-widest text-bloom-green/40 mb-1">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <h4 className="font-bold text-bloom-green">
                              Order #{order._id.slice(-6).toUpperCase()}
                            </h4>
                            <p className="text-sm text-bloom-green/60">
                              {order.items.length} items • ₦{order.totalAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-bloom-pink/20 text-bloom-pink'
                          }`}>
                            {order.status}
                          </span>
                          <button className="p-3 rounded-xl border border-bloom-green/10 text-bloom-green hover:bg-bloom-green hover:text-white transition-all">
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="text-3xl font-cormorant font-bold text-bloom-green mb-8">
                    My Favorites
                  </h3>
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Spinner />
                    </div>
                  ) : wishlistFlowers.length === 0 ? (
                    <div className="glass p-12 rounded-[2.5rem] text-center">
                      <Heart size={48} className="mx-auto text-bloom-green/20 mb-4" />
                      <p className="text-bloom-green/60">Your wishlist is empty.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {wishlistFlowers.map((flower) => (
                        <ProductCard key={flower._id} flower={flower} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass p-10 rounded-[2.5rem]"
                >
                  <h3 className="text-3xl font-cormorant font-bold text-bloom-green mb-8">
                    Update Password
                  </h3>
                  {message.text && (
                    <div className={`mb-8 p-4 rounded-xl text-sm border ${
                      message.type === 'success'
                        ? 'bg-green-50 text-green-600 border-green-100'
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {message.text}
                    </div>
                  )}
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, oldPassword: e.target.value })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/10 focus:ring-2 focus:ring-bloom-green/20 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                          }
                          className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/10 focus:ring-2 focus:ring-bloom-green/20 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                          }
                          className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/10 focus:ring-2 focus:ring-bloom-green/20 outline-none"
                        />
                      </div>
                    </div>
                    <button className="bg-bloom-green text-white px-10 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-bloom-green/20">
                      Change Password
                    </button>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;