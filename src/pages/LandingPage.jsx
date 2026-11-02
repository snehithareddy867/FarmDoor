import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import HowItWorks from '../components/HowItWorks';
import WhyFarmToHome from '../components/WhyFarmToHome';
import BecomeFarmer from '../components/BecomeFarmer';
import Footer from '../components/Footer';
import FarmerModal from '../components/FarmerModal';
import ProductModal from '../components/ProductModal';
import Toast from '../components/Toast';
import { useCart } from '../context/CartContext';

export default function LandingPage() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFarmerModalOpen, setIsFarmerModalOpen] = useState(false);
  const [productModal, setProductModal] = useState({ isOpen: false, product: null });
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const handleAddToCart = (product, quantity = 1) => {
    const res = addToCart(product, quantity);
    if (res.success) {
      triggerToast(`Added ${quantity} × ${product.name} to your basket!`);
    } else {
      triggerToast(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f2] text-[#1b4332] selection:bg-[#52b788] selection:text-[#081c15]">
      {/* 1. Navbar */}
      <Navbar
        onOpenFarmerModal={() => setIsFarmerModalOpen(true)}
      />

      <main>
        {/* 2. Hero Section with Background Video */}
        <Hero 
          onOpenFarmerModal={() => setIsFarmerModalOpen(true)} 
        />

        {/* 3. Product Categories */}
        <Categories
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
        />

        {/* 4. Featured Products (Marketplace Preview) */}
        <FeaturedProducts
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
          onAddToCart={handleAddToCart}
          onOpenProductModal={(product) => setProductModal({ isOpen: true, product })}
        />

        {/* 5. How It Works */}
        <HowItWorks />

        {/* 6. Why Farm to Home */}
        <WhyFarmToHome />

        {/* 7. Become a Farmer */}
        <BecomeFarmer
          onOpenFarmerModal={() => setIsFarmerModalOpen(true)}
        />
      </main>

      {/* 8. Footer */}
      <Footer
        onOpenFarmerModal={() => setIsFarmerModalOpen(true)}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          const shop = document.getElementById('shop');
          if (shop) shop.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Farmer Registration Modal */}
      <FarmerModal
        isOpen={isFarmerModalOpen}
        onClose={() => setIsFarmerModalOpen(false)}
        onNotify={triggerToast}
      />

      {/* Product Quick View Modal */}
      <ProductModal
        isOpen={productModal.isOpen}
        product={productModal.product}
        onClose={() => setProductModal({ isOpen: false, product: null })}
        onAddToCart={handleAddToCart}
        onNotify={triggerToast}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
}

