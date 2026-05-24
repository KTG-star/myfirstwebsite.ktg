import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Flower } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('Popular');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Roses', 'Tulips', 'Sunflowers', 'Lilies', 'Orchids', 'Peonies', 'Bouquets', 'Seasonal', 'Other'];

  useEffect(() => {
    const fetchFlowers = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/flowers`, {
          params: { category, search, sort, page, limit: 12 }
        });
        if (data.success) {
          setFlowers(data.data.flowers);
          setTotal(data.data.total);
          setPages(data.data.pages);
        }
      } catch (error) {
        console.error("Error fetching flowers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlowers();
  }, [category, search, sort, page]);

  return (
    <div className="pt-32 pb-24 px-6 bg-bloom-cream min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-cormorant text-bloom-green mb-4"
          >
            The Flower <span className="italic">Collection</span>
          </motion.h1>
          <p className="text-bloom-green/60 italic">Find the perfect bloom for any story you want to tell.</p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12 glass p-4 rounded-3xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setSearchParams({ category: cat });
                  setPage(1);
                }}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  category === cat 
                    ? 'bg-bloom-green text-white' 
                    : 'bg-white/40 text-bloom-green hover:bg-white/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-bloom-green/40" size={18} />
              <input 
                type="text"
                placeholder="Search flowers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/40 border-none focus:ring-2 focus:ring-bloom-green/20 placeholder:text-bloom-green/20"
              />
            </div>
            
            <div className="relative group">
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-white/40 border-none py-3 pl-6 pr-12 rounded-2xl text-sm font-medium text-bloom-green focus:ring-2 focus:ring-bloom-green/20"
              >
                <option>Popular</option>
                <option>Price Low-High</option>
                <option>Price High-Low</option>
                <option>Newest</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-bloom-green/40 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode='wait'>
          {loading ? (
            <motion.div 
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-3xl bg-white/40 animate-pulse" />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {flowers.map((flower) => (
                <ProductCard key={flower._id} flower={flower} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-16 flex justify-center gap-4">
            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-12 h-12 rounded-full font-bold transition-all ${
                  page === i + 1 
                    ? 'bg-bloom-green text-white' 
                    : 'bg-white/40 text-bloom-green hover:bg-white/60'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {flowers.length === 0 && !loading && (
          <div className="text-center py-24">
            <p className="text-2xl font-cormorant text-bloom-green/40 italic">No flowers found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
