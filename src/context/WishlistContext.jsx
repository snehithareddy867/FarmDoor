import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService, STORAGE_KEYS } from '../services/storage';
import { api } from '../services/api';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loadWishlist = async () => {
      const user = storageService.get(STORAGE_KEYS.CUSTOMER_USER);
      if (user?.id) {
        try {
          const remoteItems = await api.getWishlist(user.id);
          if (Array.isArray(remoteItems) && remoteItems.length > 0) {
            const formatted = remoteItems.map((i) => ({ ...i, id: i.productId || i.id }));
            setWishlist(formatted);
            storageService.set(STORAGE_KEYS.WISHLIST, formatted);
            return;
          }
        } catch {}
      }
      const saved = storageService.get(STORAGE_KEYS.WISHLIST);
      if (saved && Array.isArray(saved)) {
        setWishlist(saved);
      } else {
        setWishlist([]);
        storageService.set(STORAGE_KEYS.WISHLIST, []);
      }
    };
    loadWishlist();
  }, []);

  const saveWishlist = (items) => {
    setWishlist(items);
    storageService.set(STORAGE_KEYS.WISHLIST, items);
  };

  const addToWishlist = (product) => {
    if (!isInWishlist(product.id)) {
      const item = {
        id: product.id,
        productId: product.id,
        name: product.name,
        category: product.category,
        farmerName: product.farmerName,
        farmLocation: product.farmLocation,
        price: product.price,
        unit: product.unit,
        availableQuantity: product.availableQuantity,
        image: product.images?.[0] || product.image,
        status: product.status || 'active'
      };
      const updated = [...wishlist, item];
      saveWishlist(updated);
      const user = storageService.get(STORAGE_KEYS.CUSTOMER_USER);
      if (user?.id) {
        api.addToWishlist(user.id, item).catch(() => {});
      }
    }
  };

  const removeFromWishlist = (productId) => {
    const updated = wishlist.filter((item) => item.id !== productId);
    saveWishlist(updated);
    const user = storageService.get(STORAGE_KEYS.CUSTOMER_USER);
    if (user?.id) {
      api.removeFromWishlist(user.id, productId).catch(() => {});
    }
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      return false;
    } else {
      addToWishlist(product);
      return true;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}

