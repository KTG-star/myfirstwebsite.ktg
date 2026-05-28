import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Heart, ArrowLeft, Truck, RefreshCw, ShieldCheck, Star, ChevronRight, Plus, Minus, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FlowerImage from '../components/FlowerImage';
import { Flower } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { user, wishlist, toggleWishlist } = useAuth();
  const [flower, setFlower] = useState<Flower | null>(null);
  const [related, setRelated] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchFlower = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/flowers/${id}`);
        if (data.success) {
          setFlower(data.data);
          const relatedRes = await axios.get(`${API_URL}/flowers?category=${data.data.category}&limit=4`);
          setRelated(relatedRes.data.data.flowers.filter((f: Flower) => f._id !== id));
        }
      } catch (error) {
        console.error("Fetch flower failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlower();
    window.scrollTo(0, 0);
  }, [id]);

  const isLiked = id ? wishlist?.includes(id) : false;

  const handleAddToCart = () => {
    if (flower) {
      addToCart(flower, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) return (
    <div className="pt-32 flex justify-center h-screen bg-bloom-cream">
      <Loader2 className="animate-spin text-bloom-green" size={48} />
    </div>
  );

  if (!flower) return (
    <div className="pt-32 text-center h-screen bg-bloom-cream">
      <h2 className="text-3xl font-cormorant text-bloom-green">Flower not found</h2>
      <Link to="/shop" className="text-bloom-pink font-bold mt-4 inline-block">Back to Shop</Link>
    </div>
  );

  return (
    <div className="pt-32 pb-24 px-6 bg-bloom-cream">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-bloom-green/60 mb-12">
          <Link to="/" className="hover:text-bloom-pink transition-colors">Home</Link>
          <ChevronRight size={10} className="opacity-40" />
          <Link to="/shop" className="hover:text-bloom-pink transition-colors">Collection</Link>
          <ChevronRight size={10} className="opacity-40" />
          <span className="text-bloom-green/40">{flower.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl"
          >
            <FlowerImage 
              flowerName={flower.name}
              photoIds={flower.photoIds || []}
              originalImage={flower.image}
              alt={flower.name}
              className="absolute inset-0 w-full h-full"
            />
            <button
              onClick={() => toggleWishlist(flower._id)}
              className={`absolute top-8 right-8 p-4 rounded-full backdrop-blur-md transition-all shadow-lg ${
                isLiked ? 'bg-bloom-pink text-white' : 'bg-white/40 text-bloom-green hover:bg-white/60'
              }`}
            >
              <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
            </button>
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-bloom-pink mb-4">{flower.category}</span>
            <h1 className="text-5xl md:text-7xl font-cormorant text-bloom-green mb-6 leading-tight">{flower.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-bloom-gold">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <span className="text-sm text-bloom-green/40">(24 Reviews)</span>
            </div>

            <p className="text-3xl font-cormorant font-bold text-bloom-green mb-8">₦{flower.price.toLocaleString()}</p>
            
            <p className="text-bloom-green/60 leading-relaxed text-lg mb-10 italic">
              "{flower.description}"
            </p>

            <div className="flex flex-col md:flex-row gap-6 mb-12">
              <div className="flex items-center border border-bloom-green/10 rounded-2xl overflow-hidden bg-white h-16">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-6 h-full hover:bg-bloom-green hover:text-white transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(flower.stockQuantity, quantity + 1))}
                  className="px-6 h-full hover:bg-bloom-green hover:text-white transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={flower.stockQuantity === 0}
                className={`flex-1 h-16 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl transition-all ${
                  added 
                    ? 'bg-bloom-green text-white shadow-bloom-green/20' 
                    : flower.stockQuantity === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-bloom-green text-white hover:bg-bloom-deep shadow-bloom-green/20'
                }`}
              >
                {added ? (
                  <>Added to Bag! 🌸</>
                ) : flower.stockQuantity === 0 ? (
                  'Out of Stock'
                ) : (
                  <><ShoppingBag size={20} /> Add to Bag</>
                )}
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-bloom-green/5">
              <div className="flex flex-col items-center text-center gap-3">
                <Truck className="text-bloom-pink" size={24} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Same Day Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <RefreshCw className="text-bloom-gold" size={24} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Freshness Guarantee</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <ShieldCheck className="text-bloom-green" size={24} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Secure Checkout</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-32">
            <h2 className="text-4xl font-cormorant text-bloom-green mb-12">You Might Also <span className="italic">Love</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map(f => (
                <ProductCard key={f._id} flower={f} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
