import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Sun, Moon, Wind, Coffee, Music, CloudRain } from 'lucide-react';
import { Link } from 'react-router-dom';

const QUESTIONS = [
  {
    question: "How are you feeling today?",
    options: [
      { label: "Radiant & Energetic", icon: <Sun className="text-yellow-500" />, category: "Sunflowers" },
      { label: "Calm & Reflective", icon: <Moon className="text-blue-500" />, category: "Lilies" },
      { label: "Romantic & Dreamy", icon: <Heart className="text-pink-500" />, category: "Roses" },
      { label: "Playful & Bold", icon: <Sparkles className="text-purple-500" />, category: "Tulips" }
    ]
  },
  {
    question: "What's your ideal setting?",
    options: [
      { label: "Quiet Morning Coffee", icon: <Coffee />, category: "Lilies" },
      { label: "Dancing in the Rain", icon: <CloudRain />, category: "Tulips" },
      { label: "Sunset Walk", icon: <Wind />, category: "Sunflowers" },
      { label: "Candlelit Dinner", icon: <Music />, category: "Roses" }
    ]
  }
];

const MoodQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (category: string) => {
    const newAnswers = [...answers, category];
    if (step < QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setStep(step + 1);
    } else {
      setAnswers(newAnswers);
      setShowResult(true);
    }
  };

  const getResult = () => {
    const counts: Record<string, number> = {};
    answers.forEach(cat => counts[cat] = (counts[cat] || 0) + 1);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  return (
    <section className="py-32 px-6 bg-bloom-cream overflow-hidden">
      <div className="max-w-4xl mx-auto glass p-12 md:p-24 rounded-[3rem] relative">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Sparkles size={200} />
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div 
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center relative z-10"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-bloom-pink font-bold mb-6">Step {step + 1} of {QUESTIONS.length}</p>
              <h2 className="text-4xl md:text-6xl font-cormorant text-bloom-green mb-12">{QUESTIONS[step].question}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {QUESTIONS[step].options.map((option, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAnswer(option.category)}
                    className="p-8 rounded-3xl bg-white/50 border border-bloom-green/5 hover:border-bloom-pink transition-all flex items-center gap-6 text-left group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:bg-bloom-pink group-hover:text-white transition-colors">
                      {option.icon}
                    </div>
                    <span className="text-xl font-cormorant font-bold text-bloom-green">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Sparkles className="text-bloom-gold mx-auto mb-8" size={64} />
              <h2 className="text-3xl font-cormorant text-bloom-green/60 mb-2">Your Perfect Match is...</h2>
              <h3 className="text-6xl md:text-8xl font-cormorant text-bloom-green mb-12 italic">{getResult()}</h3>
              
              <Link to={`/shop?category=${getResult()}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-bloom-green text-white px-12 py-5 rounded-full font-bold text-lg shadow-xl shadow-bloom-green/20"
                >
                  Shop Your Mood
                </motion.button>
              </Link>
              
              <button 
                onClick={() => { setStep(0); setShowResult(false); setAnswers([]); }}
                className="block mx-auto mt-8 text-bloom-green/40 hover:text-bloom-green transition-colors font-medium"
              >
                Restart Quiz
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MoodQuiz;
