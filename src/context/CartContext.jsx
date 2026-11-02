import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService, STORAGE_KEYS } from '../services/storage';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [deliveryMethod, setDeliveryMethod] = useState('platform'); // 'platform' or 'farmer'

  useEffect(() => {
    const saved = storageService.get(STORAGE_KEYS.CART);
    if (saved && Array.isArray(saved)) {
      setCart(saved);
    } else {
      setCart([]);
      storageService.set(STORAGE_KEYS.CART, []);
    }
  }, []);

  const saveCart = (items) => {
    setCart(items);
    storageService.set(STORAGE_KEYS.CART, items);
  };

  const addToCart = (product, quantity = 1) => {
    const freshStock = product.availableQuantity !== undefined ? product.availableQuantity : 99;
    if (freshStock <= 0) {
      return { success: false, message: 'Sorry, this product is currently out of stock.' };
    }

    const existingIndex = cart.findIndex((item) => item.id === product.id);
    let updated;

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      const targetQty = currentQty + quantity;
      if (targetQty > freshStock) {
        return {
          success: false,
          message: `Only ${freshStock} ${product.unit} available. Cannot add more.`
        };
      }
      updated = [...cart];
      updated[existingIndex].quantity = targetQty;
    } else {
      const targetQty = Math.min(quantity, freshStock);
      updated = [
        ...cart,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          unit: product.unit,
          availableQuantity: freshStock,
          farmerId: product.farmerId,
          farmerName: product.farmerName,
          farmLocation: product.farmLocation,
          image: product.images?.[0] || product.image,
          quantity: targetQty
        }
      ];
    }

    saveCart(updated);
    return { success: true, message: `Added ${product.name} to cart!` };
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    // Check available stock in live products
    const liveProduct = storageService.getProductById(productId);
    const maxStock = liveProduct ? liveProduct.availableQuantity : 99;

    if (newQuantity > maxStock) {
      return {
        success: false,
        message: `Only ${maxStock} units currently available in farmer inventory.`
      };
    }

    const updated = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updated);
    return { success: true };
  };

  const removeFromCart = (productId) => {
    const updated = cart.filter((item) => item.id !== productId);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Delivery fee logic
  // Platform delivery: ₹40, Free above ₹499
  // Farmer direct delivery: ₹50, Free above ₹699
  const deliveryFee =
    subtotal === 0
      ? 0
      : deliveryMethod === 'platform'
      ? subtotal >= 499 ? 0 : 40
      : subtotal >= 699 ? 0 : 50;

  const total = subtotal + deliveryFee;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        deliveryFee,
        total,
        deliveryMethod,
        setDeliveryMethod,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

