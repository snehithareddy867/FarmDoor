import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Home, 
  Store, 
  Grid, 
  Heart, 
  ShoppingCart, 
  Package, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  CreditCard,
  BookOpen
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotifications } from '../../context/NotificationContext';

export default function CustomerNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useCustomerAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#081c15] border-b border-[#2d6a4f]/40 shadow-lg">
        {/* Top Freshness Guarantee Micro-Banner */}
        <div className="bg-gradient-to-r from-[#133926] via-[#1b4332] to-[#133926] text-[#d8f3dc] text-[11px] font-semibold py-1 px-4 text-center border-b border-[#52b788]/20 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#52b788] animate-ping" />
          <span>Dawn Harvest Guarantee: Direct farm-gate dispatch within 24 hours of picking</span>
          <span className="hidden sm:inline text-[#95d5b2]">• Free delivery on orders over ₹499</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center gap-6">
              <Link to="/customer/dashboard" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#52b788] to-[#1b4332] p-0.5 shadow-md group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-[#081c15] rounded-[10px] flex items-center justify-center">
                    <Sprout className="w-5 h-5 text-[#52b788]" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-outfit font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5 leading-none">
                    Farm to Home
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-[#95d5b2] mt-0.5">
                    Customer Portal
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-1">
                <Link
                  to="/customer/dashboard"
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive('/customer/dashboard')
                      ? 'bg-[#1b4332] text-white shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Home className="w-3.5 h-3.5 text-[#52b788]" />
                  Home
                </Link>

                <Link
                  to="/customer/marketplace"
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive('/customer/marketplace')
                      ? 'bg-[#1b4332] text-white shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Store className="w-3.5 h-3.5 text-[#52b788]" />
                  Shop
                </Link>

                <Link
                  to="/customer/marketplace?cat=vegetables"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
                >
                  <Grid className="w-3.5 h-3.5 text-[#52b788]" />
                  Categories
                </Link>

                <Link
                  to="/catalogue"
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive('/catalogue') || isActive('/customer/catalogue')
                      ? 'bg-[#1b4332] text-white shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#52b788]" />
                  Agri Catalogue
                </Link>

                <Link
                  to="/customer/orders"
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive('/customer/orders')
                      ? 'bg-[#1b4332] text-white shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Package className="w-3.5 h-3.5 text-[#52b788]" />
                  My Orders
                </Link>

                <Link
                  to="/customer/support"
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive('/customer/support')
                      ? 'bg-[#1b4332] text-white shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#52b788]" />
                  Help & Support
                </Link>
              </nav>
            </div>

            {/* Right Action Icons (Wishlist, Cart, Notifications, Profile) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Wishlist Shortcut */}
              <Link
                to="/customer/wishlist"
                aria-label="Wishlist"
                className="relative p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Heart className="w-5 h-5 text-[#95d5b2]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#e07a5f] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Shortcut */}
              <Link
                to="/customer/cart"
                aria-label="Cart"
                className="relative p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-[#52b788]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#52b788] text-[#081c15] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Notifications Shortcut */}
              <Link
                to="/customer/notifications"
                aria-label="Notifications"
                className="relative p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Bell className="w-5 h-5 text-[#95d5b2]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[#2d6a4f]/40 text-left transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#52b788] text-[#081c15] flex items-center justify-center font-bold text-xs">
                    {user?.fullName?.charAt(0) || 'P'}
                  </div>
                  <div className="hidden md:flex flex-col">
                    <span className="text-xs font-bold text-white leading-none">
                      {user?.fullName?.split(' ')[0] || 'Customer'}
                    </span>
                    <span className="text-[10px] text-[#95d5b2] leading-none mt-0.5">
                      {user?.city || 'Pune'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#081c15] border border-[#2d6a4f]/60 shadow-2xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-[#2d6a4f]/40">
                      <p className="font-bold text-white text-sm">{user?.fullName}</p>
                      <p className="text-gray-400 truncate">{user?.email}</p>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-[#52b788]/20 text-[#74c69d] text-[10px] font-semibold mt-1">
                        Verified Customer
                      </span>
                    </div>

                    <Link
                      to="/customer/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-[#1b4332] transition-colors"
                    >
                      <User className="w-4 h-4 text-[#52b788]" />
                      My Profile & Saved Addresses
                    </Link>

                    <Link
                      to="/customer/orders"
                      className="flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-[#1b4332] transition-colors"
                    >
                      <Package className="w-4 h-4 text-[#52b788]" />
                      Order History & Tracking
                    </Link>

                    <Link
                      to="/customer/payments"
                      className="flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-[#1b4332] transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-[#52b788]" />
                      Payments & Receipts
                    </Link>

                    <Link
                      to="/customer/support"
                      className="flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-[#1b4332] transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-[#52b788]" />
                      Help & Problem Reporting
                    </Link>

                    <div className="border-t border-[#2d6a4f]/40 mt-1 pt-1">
                      <Link
                        to="/"
                        className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-[#1b4332]"
                      >
                        <Sprout className="w-4 h-4 text-[#74c69d]" />
                        Back to Landing Page
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-300 hover:text-white rounded-xl hover:bg-white/10"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0d281e] border-t border-[#2d6a4f]/40 px-4 py-3 space-y-2">
            <Link
              to="/customer/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:bg-[#1b4332]"
            >
              <Home className="w-4 h-4 text-[#52b788]" /> Home Dashboard
            </Link>
            <Link
              to="/customer/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:bg-[#1b4332]"
            >
              <Store className="w-4 h-4 text-[#52b788]" /> Browse Marketplace
            </Link>
            <Link
              to="/catalogue"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:bg-[#1b4332]"
            >
              <BookOpen className="w-4 h-4 text-[#52b788]" /> Agri Catalogue & Crop Guide
            </Link>
            <Link
              to="/customer/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:bg-[#1b4332]"
            >
              <Heart className="w-4 h-4 text-[#52b788]" /> Saved Wishlist ({wishlistCount})
            </Link>
            <Link
              to="/customer/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:bg-[#1b4332]"
            >
              <ShoppingCart className="w-4 h-4 text-[#52b788]" /> Shopping Basket ({cartCount})
            </Link>
            <Link
              to="/customer/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:bg-[#1b4332]"
            >
              <Package className="w-4 h-4 text-[#52b788]" /> My Orders & Live Tracking
            </Link>
            <Link
              to="/customer/notifications"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:bg-[#1b4332]"
            >
              <Bell className="w-4 h-4 text-[#52b788]" /> Notifications ({unreadCount})
            </Link>
            <Link
              to="/customer/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:bg-[#1b4332]"
            >
              <User className="w-4 h-4 text-[#52b788]" /> Customer Profile & Addresses
            </Link>
            <Link
              to="/customer/support"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:bg-[#1b4332]"
            >
              <HelpCircle className="w-4 h-4 text-[#52b788]" /> Help, FAQ & Complaints
            </Link>
            <div className="pt-2 border-t border-[#2d6a4f]/40 flex justify-between items-center text-xs">
              <Link to="/" className="text-[#95d5b2] hover:underline">
                View Landing Page
              </Link>
              <button onClick={handleLogout} className="text-red-400 font-bold hover:underline">
                Log Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Navigation Bar for rapid one-thumb access */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#081c15]/95 backdrop-blur-md border-t border-[#2d6a4f]/50 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <Link
          to="/customer/dashboard"
          className={`flex flex-col items-center p-1 text-[10px] font-semibold transition-colors ${
            isActive('/customer/dashboard') ? 'text-[#52b788]' : 'text-gray-400'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>

        <Link
          to="/customer/marketplace"
          className={`flex flex-col items-center p-1 text-[10px] font-semibold transition-colors ${
            isActive('/customer/marketplace') ? 'text-[#52b788]' : 'text-gray-400'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Shop</span>
        </Link>

        <Link
          to="/customer/cart"
          className={`relative flex flex-col items-center p-1 text-[10px] font-semibold transition-colors ${
            isActive('/customer/cart') ? 'text-[#52b788]' : 'text-gray-400'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute top-0 right-1 bg-[#52b788] text-[#081c15] text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        <Link
          to="/customer/orders"
          className={`flex flex-col items-center p-1 text-[10px] font-semibold transition-colors ${
            isActive('/customer/orders') ? 'text-[#52b788]' : 'text-gray-400'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders</span>
        </Link>

        <Link
          to="/customer/profile"
          className={`flex flex-col items-center p-1 text-[10px] font-semibold transition-colors ${
            isActive('/customer/profile') ? 'text-[#52b788]' : 'text-gray-400'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </Link>
      </div>
    </>
  );
}

