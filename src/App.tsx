import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import LandingPage from './pages/LandingPage';

const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center bg-bloom-cream">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-bloom-pink border-t-transparent rounded-full animate-spin" />
      <p className="font-cormorant text-bloom-green italic text-xl">
        Cultivating your experience...
      </p>
    </div>
  </div>
);

const ProtectedRoute = ({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppProvider>
          <Router>
            <div className="relative min-h-screen bg-bloom-cream font-dmsans text-bloom-green">
              <CustomCursor />
              <Navbar />

              <main>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/shop/:id" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <UserDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute adminOnly>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Suspense>
              </main>

              <footer className="bg-bloom-green text-bloom-cream py-24 px-8 border-t border-white/5">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-left">
                  <div className="md:col-span-2">
                    <h3 className="font-cormorant text-3xl mb-8">
                      Kevin's{' '}
                      <span className="text-bloom-pink">Blooms</span>
                    </h3>
                    <p className="text-bloom-cream/60 leading-relaxed max-w-sm">
                      We believe every flower tells a story. Since 2026, we have
                      been creating premium floral experiences that elevate the
                      everyday.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-xs mb-8 text-bloom-pink">
                      Experience
                    </h4>
                    <ul className="space-y-4 text-sm text-bloom-cream/80">
                      <li>
                        <a href="#" className="hover:text-bloom-pink transition-colors">
                          Our Story
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-bloom-pink transition-colors">
                          Care Guide
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-xs mb-8 text-bloom-pink">
                      Support
                    </h4>
                    <ul className="space-y-4 text-sm text-bloom-cream/80">
                      <li>
                        <a href="#" className="hover:text-bloom-pink transition-colors">
                          Contact Us
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-bloom-pink transition-colors">
                          FAQ
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                  <p className="text-xs text-bloom-cream/40">
                    2026 Kevin's Blooms. All rights reserved.
                  </p>
                </div>
              </footer>

              
              
            </div>
          </Router>
        </AppProvider>
      </CartProvider>
    </AuthProvider>
  );
}