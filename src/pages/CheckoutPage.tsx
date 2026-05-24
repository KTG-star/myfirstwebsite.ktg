import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, CheckCircle2, ArrowLeft, Send } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CheckoutPage = () => {
  const { cart, subtotal, deliveryFee, city, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    deliveryAddress: '',
    deliveryDate: '',
    timeSlot: 'Morning (8AM - 12PM)',
    giftMessage: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) {
      setError('Please select a city on the cart page first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cart.map(item => ({ flowerId: item._id, quantity: item.quantity })),
        recipientName: formData.recipientName,
        recipientPhone: formData.recipientPhone,
        deliveryAddress: formData.deliveryAddress,
        city: city,
        deliveryDate: formData.deliveryDate,
        timeSlot: formData.timeSlot,
        giftMessage: formData.giftMessage
      };

      const { data } = await axios.post(`${API_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });

      if (data.success) {
        setSuccess(true);
        clearCart();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bloom-cream px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 rounded-3xl text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-bloom-green text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-bloom-green/20">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-4xl font-cormorant text-bloom-green mb-4">Order Placed!</h2>
          <p className="text-bloom-green/60 mb-8">Your flowers are being prepared with love. You can track your order in your dashboard.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-bloom-green text-white py-4 rounded-xl font-bold hover:bg-bloom-deep transition-all"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-bloom-cream min-h-screen">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-bloom-green/60 hover:text-bloom-green transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Bag
        </button>

        <h1 className="text-4xl md:text-6xl font-cormorant text-bloom-green mb-12">Final <span className="italic">Touch</span></h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Delivery Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-2xl font-cormorant font-bold text-bloom-green mb-8">Delivery Details</h3>
            
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-500 text-sm border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input 
                    type="text" 
                    name="recipientName"
                    required
                    value={formData.recipientName}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full px-4 py-3 rounded-xl border border-bloom-green/10 bg-white focus:outline-none focus:ring-2 focus:ring-bloom-green/10 transition-all pt-6"
                  />
                  <label className="absolute left-4 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px]">
                    Recipient Name
                  </label>
                </div>
                <div className="relative">
                  <input 
                    type="tel" 
                    name="recipientPhone"
                    required
                    value={formData.recipientPhone}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full px-4 py-3 rounded-xl border border-bloom-green/10 bg-white focus:outline-none focus:ring-2 focus:ring-bloom-green/10 transition-all pt-6"
                  />
                  <label className="absolute left-4 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px]">
                    Recipient Phone
                  </label>
                </div>
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  name="deliveryAddress"
                  required
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full px-4 py-3 rounded-xl border border-bloom-green/10 bg-white focus:outline-none focus:ring-2 focus:ring-bloom-green/10 transition-all pt-6"
                />
                <label className="absolute left-4 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px]">
                  Delivery Address
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input 
                    type="date" 
                    name="deliveryDate"
                    required
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full px-4 py-3 rounded-xl border border-bloom-green/10 bg-white focus:outline-none focus:ring-2 focus:ring-bloom-green/10 transition-all pt-6"
                  />
                  <label className="absolute left-4 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px]">
                    Delivery Date
                  </label>
                </div>
                <div className="relative">
                  <select 
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    className="peer w-full px-4 py-3 rounded-xl border border-bloom-green/10 bg-white focus:outline-none focus:ring-2 focus:ring-bloom-green/10 transition-all pt-6 appearance-none"
                  >
                    <option>Morning (8AM - 12PM)</option>
                    <option>Afternoon (12PM - 4PM)</option>
                    <option>Evening (4PM - 8PM)</option>
                  </select>
                  <label className="absolute left-4 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 transition-all">
                    Time Slot
                  </label>
                </div>
              </div>

              <div className="relative">
                <textarea 
                  name="giftMessage"
                  value={formData.giftMessage}
                  onChange={handleChange}
                  placeholder=" "
                  rows={4}
                  className="peer w-full px-4 py-3 rounded-xl border border-bloom-green/10 bg-white focus:outline-none focus:ring-2 focus:ring-bloom-green/10 transition-all pt-6"
                />
                <label className="absolute left-4 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px]">
                  Gift Message (Optional)
                </label>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full bg-bloom-green text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-bloom-deep transition-all shadow-xl shadow-bloom-green/20 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Place Order</>}
              </motion.button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="glass p-10 rounded-[2.5rem] sticky top-32">
              <h3 className="text-2xl font-cormorant font-bold text-bloom-green mb-8">Summary</h3>
              
              <div className="max-h-[300px] overflow-y-auto pr-4 mb-8 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-bloom-green">{item.name}</p>
                        <p className="text-xs text-bloom-green/40">{item.quantity} x ₦{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="font-bold text-bloom-green">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-bloom-green/10">
                <div className="flex justify-between text-bloom-green/60">
                  <span>Subtotal</span>
                  <span className="font-bold">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-bloom-green/60">
                  <span>Delivery ({city})</span>
                  <span className="font-bold text-bloom-gold">₦{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="pt-6 border-t border-bloom-green/10 flex justify-between items-center">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-4xl font-cormorant font-bold text-bloom-green">
                    ₦{(subtotal + deliveryFee).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
