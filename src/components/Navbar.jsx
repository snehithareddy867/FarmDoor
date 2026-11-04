import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  ChevronRight,
  Sparkles,
  LogIn,
  Store,
  LayoutDashboard,
  Bike,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useCart } from '../context/CartContext';
import { storageService, STORAGE_KEYS } from '../services/storage';

export default function Navbar({ 
  onOpenCart, 
  onOpenFarmerModal
}) {
  const navigate = useNavigate();
  const { user, logout } = useCustomerAuth();
  const { cartCount } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeRole = storageService.getActiveRole();
  const activeFarmer = activeRole === 'farmer' ? storageService.get(STORAGE_KEYS.FARMER_USER) : null;
  const activeCourier = activeRole === 'delivery' ? storageService.getCurrentDeliveryPartner() : null;
  const activeAdmin = activeRole === 'admin' ? storageService.getCurrentAdmin() : null;

  const handleRoleLogout = () => {
    storageService.clearActiveRole();
    if (activeRole === 'customer') logout();
    if (activeRole === 'farmer') storageService.remove(STORAGE_KEYS.FARMER_USER);
    if (activeRole === 'delivery') storageService.remove(STORAGE_KEYS.DELIVERY_USER);
    if (activeRole === 'admin') storageService.setCurrentAdmin(null);
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#081c15]/95 backdrop-blur-md shadow-lg border-b border-[#2d6a4f]/30 py-3' 
          : 'bg-gradient-to-b from-[#081c15]/85 via-[#081c15]/40 to-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              onClick={() => scrollToSection('hero')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#52b788] to-[#1b4332] p-0.5 shadow-md group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#081c15] rounded-[10px] flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-[#52b788]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-outfit font-extrabold text-xl text-white tracking-tight flex items-center gap-1.5">
                  Farm to Home
                  <span className="w-2 h-2 rounded-full bg-[#52b788] animate-pulse"></span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#95d5b2]">
                  Fresh Farm Marketplace
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-white/90">
              <button 
                onClick={() => scrollToSection('hero')}
                className="hover:text-[#74c69d] transition-colors py-1 text-white font-semibold"
              >
                Home
              </button>
              <Link 
                to="/customer/marketplace"
                className="hover:text-[#74c69d] transition-colors py-1 text-white/90 font-medium flex items-center gap-1"
              >
                <Store className="w-3.5 h-3.5 text-[#52b788]" />
                Marketplace
              </Link>
              <Link 
                to="/catalogue"
                className="hover:text-[#74c69d] transition-colors py-1 text-white/90 font-medium flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#52b788]" />
                Agri Catalogue
              </Link>
              <button 
                onClick={() => scrollToSection('categories')}
                className="hover:text-[#74c69d] transition-colors py-1 text-white/90"
              >
                Categories
              </button>
              <button 
                onClick={() => scrollToSection('why-us')}
                className="hover:text-[#74c69d] transition-colors py-1 text-white/90"
              >
                About Us
              </button>
              <Link
                to="/register?role=farmer"
                className="text-[#95d5b2] hover:text-white transition-colors font-semibold flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2d6a4f]/40 border border-[#52b788]/30 hover:bg-[#2d6a4f]/70"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#e9d8a6]" />
                Become a Farmer
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Cart Button */}
              <Link
                to="/customer/cart"
                aria-label="Open Cart"
                className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 border border-white/10"
              >
                <ShoppingCart className="w-5 h-5 text-[#95d5b2]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#e07a5f] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Account / Auth */}
              {user ? (
                <div className="hidden sm:flex items-center gap-2 pl-2">
                  <Link
                    to="/customer/dashboard"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1b4332]/80 hover:bg-[#2d6a4f] border border-[#52b788]/40 text-white text-xs transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#52b788]" />
                    <span className="font-semibold text-white">{user.fullName?.split(' ')[0]}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#52b788]/20 text-[#95d5b2] uppercase font-bold">
                      Customer
                    </span>
                  </Link>
                  <button 
                    onClick={logout}
                    className="text-xs text-gray-400 hover:text-white transition-colors underline ml-1 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : activeFarmer ? (
                <div className="hidden sm:flex items-center gap-2 pl-2">
                  <Link
                    to="/farmer/dashboard"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1b4332]/80 hover:bg-[#2d6a4f] border border-amber-400/40 text-white text-xs transition-colors"
                  >
                    <Store className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold text-white">{activeFarmer.name?.split(' ')[0]}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400/20 text-amber-300 uppercase font-bold">
                      Farmer
                    </span>
                  </Link>
                  <button 
                    onClick={handleRoleLogout}
                    className="text-xs text-gray-400 hover:text-white transition-colors underline ml-1 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : activeCourier ? (
                <div className="hidden sm:flex items-center gap-2 pl-2">
                  <Link
                    to="/delivery/dashboard"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1b4332]/80 hover:bg-[#2d6a4f] border border-blue-400/40 text-white text-xs transition-colors"
                  >
                    <Bike className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-semibold text-white">{activeCourier.fullName?.split(' ')[0] || 'Courier'}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-400/20 text-blue-300 uppercase font-bold">
                      Courier
                    </span>
                  </Link>
                  <button 
                    onClick={handleRoleLogout}
                    className="text-xs text-gray-400 hover:text-white transition-colors underline ml-1 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : activeAdmin ? (
                <div className="hidden sm:flex items-center gap-2 pl-2">
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-400/40 text-white text-xs transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-semibold text-white">{activeAdmin.name?.split(' ')[0] || 'Admin'}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-400/20 text-cyan-300 uppercase font-bold">
                      Admin
                    </span>
                  </Link>
                  <button 
                    onClick={handleRoleLogout}
                    className="text-xs text-gray-400 hover:text-white transition-colors underline ml-1 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link 
                    to="/login"
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:text-[#95d5b2] hover:bg-white/5 transition-all flex items-center gap-1.5"
                  >
                    <LogIn className="w-4 h-4 text-[#74c69d]" />
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    className="px-4 py-2 rounded-xl text-sm font-bold text-[#081c15] bg-[#52b788] hover:bg-[#74c69d] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="fixed top-20 right-4 left-4 bg-[#081c15] border border-[#2d6a4f]/50 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-3 font-medium text-white text-base">
              <button 
                onClick={() => scrollToSection('hero')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#1b4332] flex items-center justify-between"
              >
                Home <ChevronRight className="w-4 h-4 text-[#52b788]" />
              </button>
              <Link 
                to="/customer/marketplace"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#1b4332] flex items-center justify-between text-white"
              >
                Shop Marketplace <ChevronRight className="w-4 h-4 text-[#52b788]" />
              </Link>
              <Link 
                to="/customer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#1b4332] flex items-center justify-between text-white"
              >
                Customer Dashboard <ChevronRight className="w-4 h-4 text-[#52b788]" />
              </Link>
              <button 
                onClick={() => scrollToSection('categories')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#1b4332] flex items-center justify-between"
              >
                Categories <ChevronRight className="w-4 h-4 text-[#52b788]" />
              </button>
              <button 
                onClick={() => scrollToSection('why-us')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#1b4332] flex items-center justify-between"
              >
                About Us & Transparency <ChevronRight className="w-4 h-4 text-[#52b788]" />
              </button>
              <Link 
                to="/register?role=farmer"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left py-2.5 px-3 rounded-xl bg-[#1b4332] text-[#95d5b2] font-semibold flex items-center justify-between border border-[#52b788]/30"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#e9d8a6]" />
                  Become a Farmer
                </span>
                <ChevronRight className="w-4 h-4 text-[#52b788]" />
              </Link>
            </div>

            <div className="pt-4 border-t border-[#2d6a4f]/40 flex flex-col gap-2.5">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-gray-300">Signed in as <strong className="text-white">{user.fullName}</strong> (Customer)</div>
                  <Link
                    to="/customer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl text-center bg-[#52b788] text-[#081c15] font-bold"
                  >
                    Go to Customer Dashboard
                  </Link>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); logout(); }}
                    className="w-full py-2 rounded-xl text-center bg-white/5 text-gray-300 border border-white/10 font-medium"
                  >
                    Log Out
                  </button>
                </div>
              ) : activeFarmer ? (
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-gray-300">Signed in as <strong className="text-white">{activeFarmer.name}</strong> (Farmer)</div>
                  <Link
                    to="/farmer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl text-center bg-[#52b788] text-[#081c15] font-bold"
                  >
                    Go to Farmer Workspace
                  </Link>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); handleRoleLogout(); }}
                    className="w-full py-2 rounded-xl text-center bg-white/5 text-gray-300 border border-white/10 font-medium"
                  >
                    Log Out
                  </button>
                </div>
              ) : activeCourier ? (
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-gray-300">Signed in as <strong className="text-white">{activeCourier.fullName}</strong> (Courier)</div>
                  <Link
                    to="/delivery/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl text-center bg-blue-500 text-white font-bold"
                  >
                    Go to Courier Portal
                  </Link>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); handleRoleLogout(); }}
                    className="w-full py-2 rounded-xl text-center bg-white/5 text-gray-300 border border-white/10 font-medium"
                  >
                    Log Out
                  </button>
                </div>
              ) : activeAdmin ? (
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-gray-300">Signed in as <strong className="text-white">{activeAdmin.name}</strong> (Admin)</div>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl text-center bg-cyan-500 text-slate-950 font-bold"
                  >
                    Go to Admin Console
                  </Link>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); handleRoleLogout(); }}
                    className="w-full py-2 rounded-xl text-center bg-white/5 text-gray-300 border border-white/10 font-medium"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 rounded-xl text-center bg-white/10 text-white font-medium hover:bg-white/20"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 rounded-xl text-center bg-[#52b788] text-[#081c15] font-bold shadow-md hover:bg-[#74c69d]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
