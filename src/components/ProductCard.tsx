import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Flower } from '../types';

interface ProductCardProps {
  flower: Flower;
}

const ProductCard: React.FC<ProductCardProps> = ({ flower }) => {
  const { addToCart } = useCart();
  const { user, wishlist, toggleWishlist } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [showPetals, setShowPetals] = useState(false);

  const isLiked = wishlist?.includes(flower._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(flower, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      // Handle redirect to login or show toast
      return;
    }
    
    setShowPetals(true);
    setTimeout(() => setShowPetals(false), 1000);
    await toggleWishlist(flower._id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group rounded-3xl overflow-hidden aspect-[4/5] bg-bloom-cream shadow-sm"
    >
      <Link to={`/shop/${flower._id}`}>
        <img 
          src={flower.image} 
          alt={flower.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Liked Petal Burst */}
        <AnimatePresence>
          {showPetals && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, scale: 0 }}
                  animate={{ 
                    opacity: 0, 
                    scale: 1.5,
                    x: Math.cos(i * 60 * (Math.PI / 180)) * 50,
                    y: Math.sin(i * 60 * (Math.PI / 180)) * 50
                  }}
                  className="absolute text-xl"
                >
                  🌸
                </motion.span>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Top Actions */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className={`p-3 rounded-full backdrop-blur-md transition-colors ${
              isLiked ? 'bg-bloom-pink text-white' : 'bg-white/40 text-bloom-green hover:bg-white/60'
            }`}
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.8, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            </motion.div>
          </motion.button>
        </div>

        {/* Stock Badge */}
        {flower.stockQuantity <= 5 && flower.stockQuantity > 0 && (
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 rounded-full bg-orange-500/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest">
              Low Stock
            </span>
          </div>
        )}
        {flower.stockQuantity === 0 && (
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 rounded-full bg-red-500/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest">
              Out of Stock
            </span>
          </div>
        )}

        {/* Glass Panel */}
        <motion.div 
          animate={{ height: isHovered ? '45%' : '35%' }}
          className="absolute bottom-0 left-0 w-full glass p-6 flex flex-col justify-end transition-all duration-500"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-bloom-green/60 mb-1 block">
                {flower.category}
              </span>
              <h3 className="text-xl font-cormorant font-bold leading-tight">
                {flower.name}
              </h3>
            </div>
            <p className="text-lg font-cormorant font-bold text-bloom-green">
              ₦{flower.price.toLocaleString()}
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            className="flex items-center justify-between mt-4"
          >
            <button
              disabled={flower.stockQuantity === 0}
              onClick={handleAddToCart}
              className={`flex-1 mr-3 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                added 
                  ? 'bg-bloom-green text-white' 
                  : flower.stockQuantity === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-bloom-green text-bloom-cream hover:bg-bloom-deep'
              }`}
            >
              {added ? (
                <>Added! 🌸</>
              ) : flower.stockQuantity === 0 ? (
                <>Out of Stock</>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  Add to Cart
                </>
              )}
            </button>
            <div className="w-12 h-12 rounded-xl border border-bloom-green/20 flex items-center justify-center text-bloom-green hover:bg-bloom-green hover:text-white transition-colors">
              <ArrowUpRight size={20} />
            </div>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
