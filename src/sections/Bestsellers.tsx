import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { Flower } from '../types';

gsap.registerPlugin(ScrollTrigger);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Bestsellers = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [flowers, setFlowers] = useState<Flower[]>([]);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/flowers?limit=8&sort=Most Popular`);
        if (data.success) {
          setFlowers(data.data.flowers);
        }
      } catch (error) {
        console.error("Error fetching bestsellers", error);
      }
    };
    fetchBestsellers();
  }, []);

  useLayoutEffect(() => {
    if (flowers.length === 0) return;

    const ctx = gsap.context(() => {
      const scrollWidth = containerRef.current?.scrollWidth || 0;
      const windowWidth = window.innerWidth;
      
      gsap.to(containerRef.current, {
        x: () => -(scrollWidth - windowWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
          invalidateOnRefresh: true,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [flowers]);

  return (
    <section 
      ref={sectionRef} 
      id="bestsellers" 
      className="h-screen bg-bloom-cream overflow-hidden flex flex-col justify-center"
    >
      <div className="px-6 md:px-12 mb-12 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <h2 className="text-5xl md:text-8xl font-cormorant text-bloom-green">
            Curated <span className="italic text-bloom-pink">Bestsellers</span>
          </h2>
          <p className="text-bloom-green/60 font-dmsans mt-6 max-w-xl text-lg">
            Our most-loved arrangements, handpicked to bring elegance to your space.
          </p>
        </div>
        <Link to="/shop" className="hidden md:block text-bloom-pink font-bold text-lg hover:text-bloom-green transition-colors mb-4">
          View Full Collection →
        </Link>
      </div>

      <div ref={containerRef} className="flex items-center pl-6 md:pl-12 gap-8 h-[550px]">
        {flowers.map(flower => (
          <div key={flower._id} className="flex-shrink-0 w-[350px] md:w-[420px]">
            <ProductCard flower={flower} />
          </div>
        ))}
        
        {/* Call to action card at the end */}
        <div className="flex-shrink-0 w-[300px] md:w-[400px] px-12 flex flex-col items-center justify-center text-center">
            <p className="text-bloom-green/40 font-dmsans uppercase tracking-[0.3em] text-xs mb-6">Discovery</p>
            <h3 className="text-4xl font-cormorant text-bloom-green mb-8">Looking for something unique?</h3>
            <Link to="/shop">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-bloom-green text-white px-10 py-4 rounded-full font-bold"
              >
                Browse All Flowers
              </motion.button>
            </Link>
        </div>
      </div>
    </section>
  );
};

export default Bestsellers;
