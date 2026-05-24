import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Flower } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Flower, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  city: string;
  setCity: (city: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [city, setCity] = useState('');

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Flower, quantity = 1) => {
    setCart((prevItems) => {
      const existItem = prevItems.find((x) => x._id === product._id);
      if (existItem) {
        return prevItems.map((x) =>
          x._id === product._id ? { ...x, quantity: Math.min(x.quantity + quantity, x.stockQuantity) } : x
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevItems) => prevItems.filter((x) => x._id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevItems) =>
      prevItems.map((x) => (x._id === id ? { ...x, quantity } : x))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const getDeliveryFee = (city: string) => {
    const fees: Record<string, number> = {
      'Lagos': 1500,
      'Abuja': 2000,
      'Port Harcourt': 1800,
      'Owerri': 800,
      'Enugu': 1200
    };
    return fees[city] || (city ? 2500 : 0);
  };

  const deliveryFee = getDeliveryFee(city);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      subtotal,
      deliveryFee,
      city,
      setCity
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
