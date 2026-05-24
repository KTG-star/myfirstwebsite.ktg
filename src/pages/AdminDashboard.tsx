import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Package,
  Users,
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { Order, Flower, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface FlowerForm {
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  stockQuantity: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFlower, setEditingFlower] = useState<Flower | null>(null);

  const [flowerData, setFlowerData] = useState<FlowerForm>({
    name: '',
    category: 'Roses',
    description: '',
    price: 0,
    image: '',
    stockQuantity: 0,
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      if (activeTab === 'flowers' || activeTab === 'stats') {
        const { data } = await axios.get(`${API_URL}/flowers?limit=100`, config);
        setFlowers(data.data.flowers);
      }
      if (activeTab === 'orders' || activeTab === 'stats') {
        const { data } = await axios.get(`${API_URL}/orders`, config);
        setOrders(data.data);
      }
      if (activeTab === 'users' || activeTab === 'stats') {
        const { data } = await axios.get(`${API_URL}/users`, config);
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Fetch admin data failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlowerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${user?.token}` } };
    try {
      if (editingFlower) {
        await axios.put(`${API_URL}/flowers/${editingFlower._id}`, flowerData, config);
      } else {
        await axios.post(`${API_URL}/flowers`, flowerData, config);
      }
      setShowAddModal(false);
      setEditingFlower(null);
      setFlowerData({ name: '', category: 'Roses', description: '', price: 0, image: '', stockQuantity: 0 });
      fetchData();
    } catch (error) {
      console.error('Flower submit failed', error);
    }
  };

  const deleteFlower = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this flower?')) {
      try {
        await axios.delete(`${API_URL}/flowers/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        fetchData();
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await axios.patch(
        `${API_URL}/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      fetchData();
    } catch (error) {
      console.error('Status update failed', error);
    }
  };

  const stats = [
    {
      label: 'Total Revenue',
      value: `₦${orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString()}`,
      icon: <TrendingUp />,
      color: 'text-green-500',
    },
    { label: 'Total Orders', value: orders.length, icon: <ShoppingBag />, color: 'text-bloom-pink' },
    { label: 'Total Flowers', value: flowers.length, icon: <Package />, color: 'text-bloom-gold' },
    { label: 'Total Users', value: users.length, icon: <Users />, color: 'text-blue-500' },
  ];

  return (
    <div className="pt-32 pb-24 px-6 bg-bloom-cream min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl md:text-5xl font-cormorant text-bloom-green">
            Admin <span className="italic">Dashboard</span>
          </h1>
          <div className="flex gap-4 flex-wrap">
            {['stats', 'flowers', 'orders', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? 'bg-bloom-green text-white'
                    : 'bg-white/40 text-bloom-green hover:bg-white/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-8 rounded-3xl"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <p className="text-xs uppercase tracking-widest text-bloom-green/40 mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-cormorant font-bold text-bloom-green">{stat.value}</h3>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-[2.5rem]">
                <div className="flex items-center gap-2 text-red-500 mb-6">
                  <AlertCircle size={20} />
                  <h3 className="font-bold uppercase tracking-widest text-xs">Low Stock Alert</h3>
                </div>
                <div className="space-y-4">
                  {flowers.filter((f) => f.stockQuantity < 5).map((f) => (
                    <div key={f._id} className="flex justify-between items-center p-4 bg-white/40 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <img src={f.image} className="w-12 h-12 rounded-xl object-cover" alt={f.name} />
                        <span className="font-medium text-bloom-green">{f.name}</span>
                      </div>
                      <span className="text-red-500 font-bold">{f.stockQuantity} left</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass p-8 rounded-[2.5rem]">
                <h3 className="font-bold uppercase tracking-widest text-xs text-bloom-green/40 mb-6">
                  Recent Orders
                </h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o._id} className="flex justify-between items-center p-4 bg-white/40 rounded-2xl">
                      <div>
                        <p className="font-bold text-bloom-green">#{o._id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-bloom-green/40">{o.recipientName}</p>
                      </div>
                      <span className="text-bloom-pink font-bold">₦{o.totalAmount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Flowers Tab */}
        {activeTab === 'flowers' && (
          <div className="glass p-8 rounded-[2.5rem]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-cormorant font-bold text-bloom-green">Inventory Management</h3>
              <button
                onClick={() => {
                  setEditingFlower(null);
                  setFlowerData({ name: '', category: 'Roses', description: '', price: 0, image: '', stockQuantity: 0 });
                  setShowAddModal(true);
                }}
                className="bg-bloom-green text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm hover:opacity-90 transition-all"
              >
                <Plus size={18} /> Add New Flower
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-bloom-green/10 text-xs uppercase tracking-widest text-bloom-green/40">
                    <th className="px-4 py-4">Image</th>
                    <th className="px-4 py-4">Name</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Price</th>
                    <th className="px-4 py-4">Stock</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bloom-green/5">
                  {flowers.map((f) => (
                    <tr key={f._id} className="group hover:bg-white/40 transition-colors">
                      <td className="px-4 py-4">
                        <img src={f.image} className="w-12 h-12 rounded-xl object-cover" alt={f.name} />
                      </td>
                      <td className="px-4 py-4 font-bold text-bloom-green">{f.name}</td>
                      <td className="px-4 py-4 text-sm">{f.category}</td>
                      <td className="px-4 py-4 font-bold">₦{f.price.toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <span className={`font-bold ${f.stockQuantity < 5 ? 'text-red-500' : 'text-bloom-green'}`}>
                          {f.stockQuantity}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingFlower(f);
                              setFlowerData(f);
                              setShowAddModal(true);
                            }}
                            className="p-2 rounded-lg bg-white shadow-sm text-bloom-green hover:bg-bloom-green hover:text-white transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteFlower(f._id)}
                            className="p-2 rounded-lg bg-white shadow-sm text-red-400 hover:bg-red-400 hover:text-white transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative z-10 w-full max-w-2xl bg-bloom-cream p-10 rounded-[2.5rem] shadow-2xl"
              >
                <h3 className="text-3xl font-cormorant font-bold text-bloom-green mb-8">
                  {editingFlower ? 'Edit Flower' : 'Add New Flower'}
                </h3>
                <form onSubmit={handleFlowerSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4">Name</label>
                      <input
                        type="text"
                        required
                        value={flowerData.name}
                        onChange={(e) => setFlowerData({ ...flowerData, name: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/10 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4">Category</label>
                      <select
                        value={flowerData.category}
                        onChange={(e) => setFlowerData({ ...flowerData, category: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/10 outline-none"
                      >
                        {['Roses','Tulips','Sunflowers','Lilies','Orchids','Peonies','Bouquets','Seasonal','Other'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4">Description</label>
                    <textarea
                      required
                      value={flowerData.description}
                      onChange={(e) => setFlowerData({ ...flowerData, description: e.target.value })}
                      rows={3}
                      className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/10 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4">Price (₦)</label>
                      <input
                        type="number"
                        required
                        value={flowerData.price}
                        onChange={(e) => setFlowerData({ ...flowerData, price: Number(e.target.value) })}
                        className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/10 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4">Stock</label>
                      <input
                        type="number"
                        required
                        value={flowerData.stockQuantity}
                        onChange={(e) => setFlowerData({ ...flowerData, stockQuantity: Number(e.target.value) })}
                        className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/10 outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4">Image URL</label>
                    <input
                      type="text"
                      required
                      value={flowerData.image}
                      onChange={(e) => setFlowerData({ ...flowerData, image: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/10 outline-none"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-4 rounded-2xl border border-bloom-green/10 font-bold hover:bg-white transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-bloom-green text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-all"
                    >
                      {editingFlower ? 'Update Flower' : 'Save Flower'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="glass p-8 rounded-[2.5rem]">
            <h3 className="text-2xl font-cormorant font-bold text-bloom-green mb-8">Order Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-bloom-green/10 text-xs uppercase tracking-widest text-bloom-green/40">
                    <th className="px-4 py-4">ID</th>
                    <th className="px-4 py-4">Customer</th>
                    <th className="px-4 py-4">Amount</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bloom-green/5">
                  {orders.map((o) => (
                    <tr key={o._id} className="group hover:bg-white/40 transition-colors">
                      <td className="px-4 py-4 font-bold">#{o._id.slice(-6).toUpperCase()}</td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-bloom-green">{o.user?.fullName}</p>
                        <p className="text-xs text-bloom-green/40">{o.user?.email}</p>
                      </td>
                      <td className="px-4 py-4 font-bold">₦{o.totalAmount.toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          o.status === 'Delivered'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-bloom-pink/20 text-bloom-pink'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                          value={o.status}
                          className="bg-white border-none py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-widest"
                        >
                          <option>Pending</option>
                          <option>Confirmed</option>
                          <option>Out for Delivery</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="glass p-8 rounded-[2.5rem]">
            <h3 className="text-2xl font-cormorant font-bold text-bloom-green mb-8">User Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-bloom-green/10 text-xs uppercase tracking-widest text-bloom-green/40">
                    <th className="px-4 py-4">User</th>
                    <th className="px-4 py-4">Email</th>
                    <th className="px-4 py-4">Role</th>
                    <th className="px-4 py-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bloom-green/5">
                  {users.map((u) => (
                    <tr key={u._id} className="group hover:bg-white/40 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-bloom-pink/20 flex items-center justify-center text-bloom-pink font-bold text-xs uppercase">
                            {u.fullName.charAt(0)}
                          </div>
                          <span className="font-bold text-bloom-green">{u.fullName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm">{u.email}</td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          u.role === 'admin'
                            ? 'bg-bloom-green text-white'
                            : 'bg-white/40 text-bloom-green'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-bloom-green/40">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;