import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { Check, ChevronRight, ChevronLeft, ShoppingCart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import FlowerImage from '../components/FlowerImage';

gsap.registerPlugin(TextPlugin);

const STEPS = [
  { id: 1, name: 'The Base', description: 'Choose your main bloom' },
  { id: 2, name: 'The Wrap', description: 'Select a premium wrapping' },
  { id: 3, name: 'The Note', description: 'Add a personal touch' }
];

const BASES = [
  { id: 'b1', name: 'Classic Red Roses', price: 50, photoIds: ['1548013146-72479768b921'] },
  { id: 'b2', name: 'White Lilies', price: 45, photoIds: ['1508610048659-a06b669e3321'] },
  { id: 'b3', name: 'Mixed Wildflowers', price: 40, photoIds: ['1490750967868-88aa4486c946'] }
];

const WRAPS = [
  { id: 'w1', name: 'Eco-Kraft Paper', price: 0, photoIds: ['1606760227091-3dd870d97f1d'] },
  { id: 'w2', name: 'Premium Silk Ribbon', price: 10, photoIds: ['1513519245088-0e12902e35ca'] },
  { id: 'w3', name: 'Gold Foil Luxe', price: 15, photoIds: ['1530103862676-fa8c9d3433b7'] }
];

const BouquetBuilder = () => {
  const [step, setStep] = useState(1);
  const [selectedBase, setSelectedBase] = useState(BASES[0]);
  const [selectedWrap, setSelectedWrap] = useState(WRAPS[0]);
  const [message, setMessage] = useState('');
  const { addToCart } = useAppContext();
  
  const priceRef = useRef<HTMLSpanElement>(null);
  const totalPrice = selectedBase.price + selectedWrap.price;

  useEffect(() => {
    if (priceRef.current) {
      gsap.to(priceRef.current, {
        duration: 0.5,
        text: totalPrice.toString(),
        snap: { text: 1 },
        ease: 'power2.out'
      });
    }
  }, [totalPrice]);

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleComplete = () => {
    addToCart({
      id: `custom-${Date.now()}`,
      name: `Custom Bouquet (${selectedBase.name})`,
      price: totalPrice,
      quantity: 1,
      photoIds: selectedBase.photoIds
    });
    alert('Bouquet added to cart!');
    setStep(1);
    setMessage('');
  };

  return (
    <section id="builder" className="py-24 bg-bloom-cream min-h-screen flex items-center justify-center">
      <div className="container px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-cormorant text-bloom-green mb-6">
            The <span className="italic text-bloom-pink">Bouquet</span> Builder
          </h2>
          <div className="flex justify-center items-center gap-4 text-sm font-dmsans uppercase tracking-widest text-bloom-green/40">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className={`flex items-center gap-2 ${step === s.id ? 'text-bloom-gold font-bold' : step > s.id ? 'text-bloom-green' : ''}`}>
                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] ${
                    step >= s.id ? 'border-bloom-gold bg-bloom-gold text-white' : 'border-current'
                  }`}>
                    {step > s.id ? <Check className="w-3 h-3" /> : s.id}
                  </span>
                  {s.name}
                </div>
                {i < STEPS.length - 1 && <div className="w-8 h-px bg-current opacity-20" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Preview Panel */}
          <div className="relative aspect-square rounded-3xl overflow-hidden glass p-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedBase.id}-${selectedWrap.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="relative w-full h-full"
              >
                <FlowerImage 
                  flowerName={selectedBase.name}
                  photoIds={selectedBase.photoIds}
                  originalImage={selectedBase.image}
                  alt="Preview"
                  className="w-full h-full rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bloom-green/40 to-transparent pointer-events-none" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                   <p className="text-xs uppercase tracking-widest opacity-70 mb-2">Live Preview</p>
                   <h3 className="text-3xl font-cormorant">{selectedBase.name}</h3>
                   <p className="text-sm font-dmsans">Wrapped in {selectedWrap.name}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls Panel */}
          <div className="space-y-8">
            <div className="h-[400px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-3xl font-cormorant text-bloom-green">Select Your Base</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {BASES.map(b => (
                        <button
                          key={b.id}
                          onClick={() => setSelectedBase(b)}
                          className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                            selectedBase.id === b.id ? 'border-bloom-gold bg-bloom-gold/5' : 'border-bloom-pink/10 hover:border-bloom-pink/30'
                          }`}
                        >
                          <div className="flex items-center gap-4 text-left">
                            <FlowerImage 
                              flowerName={b.name}
                              photoIds={b.photoIds}
                              alt={b.name}
                              width={64}
                              height={64}
                              className="w-16 h-16 rounded-xl"
                            />
                            <div>
                              <p className="font-semibold text-bloom-green">{b.name}</p>
                              <p className="text-xs text-bloom-green/60">Starting at ${b.price}</p>
                            </div>
                          </div>
                          {selectedBase.id === b.id && <Check className="text-bloom-gold" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-3xl font-cormorant text-bloom-green">Choose Wrapping</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {WRAPS.map(w => (
                        <button
                          key={w.id}
                          onClick={() => setSelectedWrap(w)}
                          className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                            selectedWrap.id === w.id ? 'border-bloom-gold bg-bloom-gold/5' : 'border-bloom-pink/10 hover:border-bloom-pink/30'
                          }`}
                        >
                          <div className="flex items-center gap-4 text-left">
                            <FlowerImage 
                              flowerName={w.name}
                              photoIds={w.photoIds}
                              alt={w.name}
                              width={64}
                              height={64}
                              className="w-16 h-16 rounded-xl"
                            />
                            <div>
                              <p className="font-semibold text-bloom-green">{w.name}</p>
                              <p className="text-xs text-bloom-green/60">+{w.price === 0 ? 'Free' : `$${w.price}`}</p>
                            </div>
                          </div>
                          {selectedWrap.id === w.id && <Check className="text-bloom-gold" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-3xl font-cormorant text-bloom-green">Add a Personal Note</h3>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your heartfelt message here..."
                      className="w-full h-64 p-8 rounded-3xl border-2 border-bloom-pink/10 focus:border-bloom-pink focus:outline-none font-dmsans text-bloom-green bg-transparent resize-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="pt-8 border-t border-bloom-pink/10 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-bloom-green/40 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-bloom-green font-dmsans">
                  $<span ref={priceRef}>{totalPrice}</span>
                </p>
              </div>
              
              <div className="flex gap-4">
                {step > 1 && (
                  <button 
                    onClick={handleBack}
                    className="w-14 h-14 rounded-full border-2 border-bloom-pink/20 flex items-center justify-center text-bloom-green hover:border-bloom-pink transition-all"
                  >
                    <ChevronLeft />
                  </button>
                )}
                {step < 3 ? (
                  <button 
                    onClick={handleNext}
                    className="bg-bloom-green text-white px-10 py-4 rounded-full font-bold hover:bg-bloom-gold transition-all flex items-center gap-2"
                  >
                    Next Step <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={handleComplete}
                    className="bg-bloom-pink text-white px-10 py-4 rounded-full font-bold hover:bg-bloom-green transition-all flex items-center gap-2"
                  >
                    Add to Cart <ShoppingCart className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BouquetBuilder;
