import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const petals = Array.from({ length: 15 });

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden aurora-bg">
      {/* Animated Petals */}
      {petals.map((_, i) => (
        <motion.div
          key={i}
          className="petal text-2xl"
          initial={{ 
            top: -50, 
            left: `${Math.random() * 100}%`,
            opacity: 0,
            rotate: 0
          }}
          animate={{ 
            top: '110vh',
            opacity: [0, 1, 1, 0],
            rotate: 360,
            x: [0, Math.random() * 100 - 50, 0]
          }}
          transition={{ 
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
        >
          🌸
        </motion.div>
      ))}

      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-bloom-pink font-cormorant italic text-2xl md:text-3xl mb-4">
            Nature's Poetry in Every Petal
          </h2>
          <h1 className="text-5xl md:text-8xl font-cormorant text-bloom-green leading-tight mb-8">
            Fresh Flowers, <br />
            <span className="italic">Delivered With Love</span>
          </h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-bloom-green text-bloom-cream px-8 py-4 rounded-full flex items-center gap-2 font-medium hover:bg-bloom-deep transition-colors"
              >
                Explore Collection <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/40 backdrop-blur-md border border-white/40 text-bloom-green px-8 py-4 rounded-full font-medium hover:bg-white/60 transition-colors"
              >
                Sign Up Free
              </motion.button>
            </Link>
          </div>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 pt-12 border-t border-bloom-green/10"
          >
            <div className="text-center">
              <p className="text-3xl font-cormorant text-bloom-green">500+</p>
              <p className="text-xs uppercase tracking-widest text-bloom-green/60">Customers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-cormorant text-bloom-green">50+</p>
              <p className="text-xs uppercase tracking-widest text-bloom-green/60">Varieties</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-cormorant text-bloom-green">Same-Day</p>
              <p className="text-xs uppercase tracking-widest text-bloom-green/60">Delivery</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-bloom-cream to-transparent z-10" />
    </section>
  );
};

export default Hero;
