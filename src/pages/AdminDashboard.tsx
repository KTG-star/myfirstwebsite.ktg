import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSearchParams, Link } from 'react-router-dom';
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
  Truck,
  Activity,
  Award,
  ChevronRight,
  ArrowLeft,
  Clock,
  CheckCircle2,
  LayoutDashboard,
  Search,
  Bell,
  Settings,
} from 'lucide-react';
import { Order, Flower, User, ActivityLog } from '../types';
import FlowerImage from '../components/FlowerImage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface AdminStats {
  revenue: {
    today: number;
    yesterday: number;
    growth: number;
  };
  topCustomers: {
    _id: string;
    totalSpent: number;
    orderCount: number;
    fullName: string;
    email: string;
    profilePicture?: string;
  }[];
  stockAlerts: {
    lowStock: Flower[];
    outOfStock: Flower[];
    lowStockCount: number;
    outOfStockCount: number;
  };
  operationalOversight: {
    activeFlorists: number;
    activeDrivers: number;
    pendingOrders: number;
    readyForDelivery: number;
  };
}

interface FlowerForm {
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
  photoIds: string[];
  stockQuantity: number;
  lowStockThreshold: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFlower, setEditingFlower] = useState<Flower | null>(null);

  const [flowerData, setFlowerData] = useState<FlowerForm>({
    name: '',
    category: 'Roses',
    description: '',
    price: 0,
    image: '',
    photoIds: [],
    stockQuantity: 0,
    lowStockThreshold: 10,
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      
      const statsRes = await axios.get(`${API_URL}/admin/stats`, config);
      setStats(statsRes.data.data);
      
      const logsRes = await axios.get(`${API_URL}/activity-logs`, config);
      setLogs(logsRes.data.data);

      if (activeTab === 'flowers') {
        const { data } = await axios.get(`${API_URL}/flowers?limit=100`, config);
        setFlowers(data.data.flowers);
      }
      
      if (activeTab === 'orders') {
        const { data } = await axios.get(`${API_URL}/orders`, config);
        setOrders(data.data);
      }
      
      if (activeTab === 'users') {
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
      setFlowerData({ name: '', category: 'Roses', description: '', price: 0, image: '', photoIds: [], stockQuantity: 0, lowStockThreshold: 10 });
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

  const handleReward = async (userId: string) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.post(`${API_URL}/admin/reward-customer`, {
        userId,
        rewardType: 'Loyalty Discount',
        amount: 15
      }, config);
      alert(`Reward Issued! Code: ${data.data.discountCode}`);
      fetchData();
    } catch (error) {
      console.error('Reward failed', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'florist': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'driver': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'manager': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'support': return 'bg-teal-100 text-teal-600 border-teal-200';
      default: return 'bg-bloom-green/10 text-bloom-green border-bloom-green/20';
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'flowers', label: 'Inventory', icon: <Package size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { id: 'users', label: 'Staff & Users', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex bg-bloom-cream min-h-screen pt-24">
      {/* Sidebar Navigation */}
      <aside className="w-64 fixed left-0 top-24 bottom-0 bg-white border-r border-bloom-green/5 p-6 hidden lg:block z-40">
        <div className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold text-sm tracking-widest uppercase ${
                activeTab === item.id
                  ? 'bg-bloom-green text-white shadow-lg shadow-bloom-green/10'
                  : 'text-bloom-green/40 hover:bg-bloom-green/5 hover:text-bloom-green'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <div className="pt-8 mt-8 border-t border-bloom-green/5">
            <Link 
              to="/" 
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-bloom-green/40 hover:text-bloom-pink transition-all font-bold text-sm tracking-widest uppercase"
            >
              <ArrowLeft size={20} />
              Return to Site
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-6 right-6 p-6 glass rounded-[2rem] border border-bloom-pink/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-bloom-pink mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-bloom-green">All Systems Operational</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-8 lg:p-12 overflow-x-hidden">
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
             <div className="lg:hidden p-2 bg-white rounded-xl shadow-sm"><LayoutDashboard size={20}/></div>
             <h1 className="text-4xl md:text-5xl font-cormorant text-bloom-green">
              {navItems.find(i => i.id === activeTab)?.label} <span className="italic">Command</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-bloom-green/30" size={18} />
                <input 
                  type="text" 
                  placeholder="Search staff, orders, SKUs..."
                  className="pl-12 pr-6 py-3 rounded-2xl bg-white border border-bloom-green/5 outline-none focus:border-bloom-green/10 w-full transition-all text-sm"
                />
             </div>
             <button className="p-3 bg-white rounded-2xl border border-bloom-green/5 text-bloom-green/40 hover:text-bloom-pink transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-bloom-pink rounded-full border-2 border-white" />
             </button>
             <button className="p-3 bg-white rounded-2xl border border-bloom-green/5 text-bloom-green/40 hover:text-bloom-green transition-all">
                <Settings size={20} />
             </button>
          </div>
        </header>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-12">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-[2rem]">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center shadow-inner">
                    <TrendingUp size={24} />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stats.revenue.growth >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {stats.revenue.growth >= 0 ? '+' : ''}{stats.revenue.growth}%
                  </span>
                </div>
                <p className="text-xs uppercase tracking-widest text-bloom-green/40 mb-1">Total Revenue Today</p>
                <h3 className="text-3xl font-cormorant font-bold text-bloom-green">₦{stats.revenue.today.toLocaleString()}</h3>
                <p className="text-[10px] text-bloom-green/30 mt-2 italic">Yesterday: ₦{stats.revenue.yesterday.toLocaleString()}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-8 rounded-[2rem]">
                <div className="w-12 h-12 rounded-2xl bg-bloom-pink/10 text-bloom-pink flex items-center justify-center mb-6">
                  <Clock size={24} />
                </div>
                <p className="text-xs uppercase tracking-widest text-bloom-green/40 mb-1">Oversight Panel</p>
                <h3 className="text-3xl font-cormorant font-bold text-bloom-green">{stats.operationalOversight.pendingOrders}</h3>
                <p className="text-[10px] text-bloom-green/30 mt-2 italic">Pending Order Requests</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-8 rounded-[2rem]">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                  <Truck size={24} />
                </div>
                <p className="text-xs uppercase tracking-widest text-bloom-green/40 mb-1">Production Queue</p>
                <h3 className="text-3xl font-cormorant font-bold text-bloom-green">{stats.operationalOversight.readyForDelivery}</h3>
                <p className="text-[10px] text-bloom-green/30 mt-2 italic">{stats.operationalOversight.activeDrivers} Active Drivers</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-8 rounded-[2rem]">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
                  <Package size={24} />
                </div>
                <p className="text-xs uppercase tracking-widest text-bloom-green/40 mb-1">Critical Stock</p>
                <h3 className="text-3xl font-cormorant font-bold text-bloom-green">
                  {stats.stockAlerts.outOfStockCount}
                </h3>
                <p className="text-[10px] text-red-500 mt-2 font-bold uppercase">{stats.stockAlerts.lowStockCount} Items Low Stock</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Activity Log - Oversight Panel */}
              <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] flex flex-col max-h-[700px]">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-cormorant font-bold text-bloom-green">Real-Time Employee Activity Logs</h3>
                  <button onClick={fetchData} className="p-2 hover:bg-white rounded-xl transition-all text-bloom-pink"><Activity size={18} /></button>
                </div>
                <div className="flex-1 overflow-y-auto pr-4 space-y-6 custom-scrollbar">
                  {logs.length > 0 ? logs.map((log, i) => (
                    <motion.div 
                      key={log._id} 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-4 group"
                    >
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border ${getRoleBadgeColor(log.role)}`}>
                          {log.role === 'florist' && <Plus size={18} />}
                          {log.role === 'driver' && <Truck size={18} />}
                          {log.role === 'manager' && <Package size={18} />}
                          {log.role === 'support' && <Users size={18} />}
                          {log.role === 'admin' && <CheckCircle2 size={18} />}
                        </div>
                        <div className="w-px h-full bg-bloom-green/10 my-2 group-last:hidden" />
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-bold text-sm text-bloom-green">{log.user.fullName} <span className="text-[10px] uppercase font-bold text-bloom-green/30 ml-2">[{log.role}]</span></p>
                          <span className="text-[10px] text-bloom-green/30 font-bold uppercase tracking-tighter">
                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-bloom-green/60 leading-relaxed mb-2">{log.details}</p>
                        {log.metadata && (
                          <div className="text-[10px] flex gap-2 flex-wrap">
                            {Object.entries(log.metadata).slice(0, 3).map(([key, val]) => (
                              <span key={key} className="bg-white/60 px-2 py-0.5 rounded-md text-bloom-green/40 border border-bloom-green/5">
                                {key}: {String(val)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )) : (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-bloom-green/30">
                       <Activity size={48} className="mb-4 opacity-20" />
                       <p className="font-bold uppercase tracking-widest text-xs">No activity logged yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Widgets */}
              <div className="space-y-8">
                {/* Top Customers Leaderboard */}
                <div className="glass p-8 rounded-[2.5rem]">
                  <div className="flex items-center gap-2 mb-8">
                    <Award size={20} className="text-bloom-gold" />
                    <h3 className="text-xl font-cormorant font-bold text-bloom-green">Top Spending Customers</h3>
                  </div>
                  <div className="space-y-6">
                    {stats.topCustomers.map((customer, i) => (
                      <div key={customer._id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-bloom-pink/10 flex items-center justify-center text-bloom-pink font-bold text-xs">
                              {customer.fullName.charAt(0)}
                            </div>
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border border-bloom-green/10 flex items-center justify-center text-[10px] font-bold text-bloom-green">
                              {i + 1}
                            </div>
                          </div>
                          <div>
                            <p className="font-bold text-sm text-bloom-green">{customer.fullName}</p>
                            <p className="text-[10px] text-bloom-green/30 font-bold tracking-widest uppercase">
                              ₦{customer.totalSpent.toLocaleString()} • {customer.orderCount} Orders
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleReward(customer._id)}
                          className="p-2 rounded-lg bg-white/60 text-bloom-pink hover:bg-bloom-pink hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          title="Reward with Loyalty Discount"
                        >
                          <Award size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setActiveTab('users')} className="w-full mt-8 py-3 rounded-xl border border-bloom-green/5 text-xs font-bold uppercase tracking-widest text-bloom-green/40 hover:bg-white transition-all flex items-center justify-center gap-2">
                    View CRM Directory <ChevronRight size={14} />
                  </button>
                </div>

                {/* Smart Inventory & Stock Alerts */}
                <div className="glass p-8 rounded-[2.5rem] border border-red-500/10">
                  <div className="flex items-center gap-2 mb-8 text-red-500">
                    <AlertCircle size={20} />
                    <h3 className="text-xl font-cormorant font-bold text-bloom-green">Smart Stock Alerts</h3>
                  </div>
                  <div className="space-y-4">
                    {stats.stockAlerts.outOfStockCount > 0 ? stats.stockAlerts.outOfStock.map(item => (
                      <div key={item._id} className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                        <span className="font-bold text-sm text-red-600">{item.name}</span>
                        <span className="text-[10px] font-bold uppercase bg-red-600 text-white px-2 py-0.5 rounded">Hit 0</span>
                      </div>
                    )) : (
                       <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-green-600" />
                          <span className="text-xs font-bold text-green-600 uppercase tracking-widest">No Items Out of Stock</span>
                       </div>
                    )}
                    {stats.stockAlerts.lowStock.slice(0, 3).map(item => (
                      <div key={item._id} className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100">
                        <span className="font-bold text-sm text-orange-600">{item.name}</span>
                        <span className="text-[10px] font-bold uppercase text-orange-600">{item.stockQuantity} stems left</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setActiveTab('flowers')}
                    className="w-full mt-6 py-3 rounded-xl bg-bloom-green text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-bloom-green/20"
                  >
                    Manage Perishables
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Flowers Tab */}
        {activeTab === 'flowers' && (
          <div className="glass p-8 rounded-[2.5rem]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-cormorant font-bold text-bloom-green">Inventory & Sourcing</h3>
              <button
                onClick={() => {
                  setEditingFlower(null);
                  setFlowerData({ name: '', category: 'Roses', description: '', price: 0, image: '', photoIds: [], stockQuantity: 0, lowStockThreshold: 10 });
                  setShowAddModal(true);
                }}
                className="bg-bloom-green text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-bloom-green/20"
              >
                <Plus size={18} /> Add New SKU
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-bloom-green/10 text-xs uppercase tracking-widest text-bloom-green/40">
                    <th className="px-4 py-4">Visual</th>
                    <th className="px-4 py-4">Item Name</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Price</th>
                    <th className="px-4 py-4">Current Stock</th>
                    <th className="px-4 py-4">Visibility</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bloom-green/5">
                  {flowers.map((f) => (
                    <tr key={f._id} className="group hover:bg-white/40 transition-colors">
                      <td className="px-4 py-4">
                        <FlowerImage 
                          flowerName={f.name}
                          photoIds={f.photoIds || []}
                          originalImage={f.image}
                          alt={f.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-xl object-cover shadow-sm"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-bloom-green">{f.name}</p>
                        <p className="text-[10px] text-bloom-green/30 uppercase tracking-widest font-bold">Base Cost: ₦{f.unitCost?.toLocaleString() || 0}</p>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-bloom-green/60">{f.category}</td>
                      <td className="px-4 py-4 font-bold text-bloom-green">₦{f.price.toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <span className={`font-bold ${f.stockQuantity <= f.lowStockThreshold ? 'text-red-500' : 'text-bloom-green'}`}>
                          {f.stockQuantity}
                        </span>
                        <p className="text-[9px] text-bloom-green/30 uppercase font-bold">Low Alert: {f.lowStockThreshold}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${f.stockQuantity > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {f.stockQuantity > 0 ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingFlower(f);
                              setFlowerData({
                                name: f.name,
                                category: f.category,
                                description: f.description,
                                price: f.price,
                                image: f.image,
                                photoIds: f.photoIds || [],
                                stockQuantity: f.stockQuantity,
                                lowStockThreshold: f.lowStockThreshold || 10
                              });
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

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="glass p-8 rounded-[2.5rem]">
            <h3 className="text-2xl font-cormorant font-bold text-bloom-green mb-8">Order & Logistics Oversight</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-xs uppercase tracking-widest text-bloom-green/40">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Recipient Detail</th>
                    <th className="px-6 py-4">Arrangement</th>
                    <th className="px-6 py-4">Revenue</th>
                    <th className="px-6 py-4">Milestone Workflow</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} className="bg-white/40 hover:bg-white transition-all rounded-2xl overflow-hidden shadow-sm">
                      <td className="px-6 py-6 font-bold text-bloom-green rounded-l-2xl">
                        #{o._id.slice(-6).toUpperCase()}
                        <p className="text-[10px] text-bloom-green/30 font-bold uppercase mt-1">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="font-bold text-bloom-green">{o.recipientName}</p>
                        <p className="text-xs text-bloom-green/60 italic">{o.city}</p>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex -space-x-2">
                          {o.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-bloom-cream shadow-sm" title={item.flower?.name}>
                               {item.flower && (
                                 <FlowerImage 
                                    flowerName={item.flower.name}
                                    photoIds={item.flower.photoIds}
                                    originalImage={item.flower.image}
                                    alt={item.flower.name}
                                    width={32}
                                    height={32}
                                 />
                               )}
                            </div>
                          ))}
                          {o.items.length > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-bloom-pink text-white flex items-center justify-center text-[10px] font-bold">
                              +{o.items.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 font-bold text-bloom-green">₦{o.totalAmount.toLocaleString()}</td>
                      <td className="px-6 py-6 rounded-r-2xl">
                        <div className="flex items-center gap-4">
                          <select
                            onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                            value={o.status}
                            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none border-none shadow-sm cursor-pointer ${
                              o.status === 'Delivered' ? 'bg-green-100 text-green-600' : 
                              o.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                              o.status === 'Preparing' ? 'bg-orange-100 text-orange-600' :
                              o.status === 'Ready for Delivery' ? 'bg-blue-100 text-blue-600' :
                              'bg-bloom-pink/20 text-bloom-pink'
                            }`}
                          >
                            <option>Pending</option>
                            <option>Confirmed</option>
                            <option>Preparing</option>
                            <option>Ready for Delivery</option>
                            <option>Out for Delivery</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                          </select>
                          {o.status === 'Out for Delivery' && <Truck size={18} className="text-blue-500 animate-bounce" />}
                          {o.status === 'Preparing' && <Activity size={18} className="text-orange-500 animate-pulse" />}
                        </div>
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
            <h3 className="text-2xl font-cormorant font-bold text-bloom-green mb-8">User Directory & Staff Roles</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-bloom-green/10 text-xs uppercase tracking-widest text-bloom-green/40">
                    <th className="px-4 py-4">Employee / Customer</th>
                    <th className="px-4 py-4">Contact</th>
                    <th className="px-4 py-4">Role / Permissions</th>
                    <th className="px-4 py-4">Registration Date</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bloom-green/5">
                  {users.map((u) => (
                    <tr key={u._id} className="group hover:bg-white/40 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-bloom-pink/10 flex items-center justify-center text-bloom-pink font-bold text-sm shadow-inner">
                            {u.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-bloom-green">{u.fullName}</p>
                            <p className="text-[10px] text-bloom-green/30 font-bold uppercase tracking-tighter">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-bloom-green/60">{u.email}</td>
                      <td className="px-4 py-4">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${getRoleBadgeColor(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-bloom-green/40">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="px-4 py-4">
                        <button className="p-2 rounded-lg bg-white/60 text-bloom-pink hover:bg-bloom-pink hover:text-white transition-all" title="Reward Loyalty"><Award size={18}/></button>
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative z-10 w-full max-w-2xl bg-bloom-cream p-10 rounded-[3rem] shadow-2xl overflow-y-auto max-h-[90vh]">
                <h3 className="text-3xl font-cormorant font-bold text-bloom-green mb-8">{editingFlower ? 'Update Inventory SKU' : 'Add New Inventory SKU'}</h3>
                <form onSubmit={handleFlowerSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4 font-bold">Flower/Bouquet Name</label>
                      <input type="text" required value={flowerData.name} onChange={(e) => setFlowerData({ ...flowerData, name: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/5 outline-none focus:border-bloom-green/20 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4 font-bold">Category</label>
                      <select value={flowerData.category} onChange={(e) => setFlowerData({ ...flowerData, category: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/5 outline-none appearance-none">
                        {['Roses','Tulips','Sunflowers','Lilies','Orchids','Peonies','Bouquets','Seasonal','Other'].map((c) => ( <option key={c} value={c}>{c}</option> ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4 font-bold">Full Description</label>
                    <textarea required value={flowerData.description} onChange={(e) => setFlowerData({ ...flowerData, description: e.target.value })} rows={3} className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/5 outline-none focus:border-bloom-green/20 transition-all" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4 font-bold">Price (₦)</label>
                      <input type="number" required value={flowerData.price} onChange={(e) => setFlowerData({ ...flowerData, price: Number(e.target.value) })} className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/5 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4 font-bold">Stock Quantity</label>
                      <input type="number" required value={flowerData.stockQuantity} onChange={(e) => setFlowerData({ ...flowerData, stockQuantity: Number(e.target.value) })} className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/5 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4 font-bold">Low Alert Limit</label>
                      <input type="number" required value={flowerData.lowStockThreshold} onChange={(e) => setFlowerData({ ...flowerData, lowStockThreshold: Number(e.target.value) })} className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/5 outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-bloom-green/40 ml-4 font-bold">Unsplash Photo IDs</label>
                    <input type="text" required value={flowerData.photoIds.join(', ')} onChange={(e) => setFlowerData({ ...flowerData, photoIds: e.target.value.split(',').map(s => s.trim()) })} className="w-full px-6 py-4 rounded-2xl bg-white border border-bloom-green/5 outline-none" placeholder="1518709268805-4e9042af9f23..." />
                  </div>
                  <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 rounded-2xl border border-bloom-green/10 font-bold hover:bg-white transition-all text-xs uppercase tracking-widest text-bloom-green/40">Cancel</button>
                    <button type="submit" className="flex-1 bg-bloom-green text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-all text-xs uppercase tracking-widest shadow-lg shadow-bloom-green/20">{editingFlower ? 'Update Item' : 'Save Item'}</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
