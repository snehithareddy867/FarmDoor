import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { storageService, STORAGE_KEYS } from '../services/storage';

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    // Only restore user if customer role is active
    const activeRole = storageService.getActiveRole();
    const saved = storageService.get(STORAGE_KEYS.CUSTOMER_USER);
    if (saved && activeRole === 'customer') {
      setUser(saved);
    } else {
      setUser(null);
    }

    // Load addresses
    const savedAddrs = storageService.get(STORAGE_KEYS.CUSTOMER_ADDRESSES) || [];
    setAddresses(savedAddrs);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    if (res.success) {
      storageService.setActiveRole('customer');
      setUser(res.user);
      return res;
    }
    throw new Error('Login failed. Please check credentials.');
  };

  const register = async (formData) => {
    const res = await api.register(formData);
    if (res.success) {
      storageService.setActiveRole('customer');
      setUser(res.user);
      const updatedAddrs = storageService.get(STORAGE_KEYS.CUSTOMER_ADDRESSES) || [];
      setAddresses(updatedAddrs);
      return res;
    }
    throw new Error('Registration failed.');
  };

  const logout = () => {
    setUser(null);
    storageService.remove(STORAGE_KEYS.CUSTOMER_USER);
    if (storageService.getActiveRole() === 'customer') {
      storageService.clearActiveRole();
    }
  };

  const updateProfile = async (updates) => {
    const updated = await api.updateProfile(updates);
    setUser(updated);
    return updated;
  };

  const addAddress = (newAddr) => {
    const updated = [...addresses, { ...newAddr, id: `addr-${Date.now()}` }];
    setAddresses(updated);
    storageService.set(STORAGE_KEYS.CUSTOMER_ADDRESSES, updated);
  };

  const deleteAddress = (addrId) => {
    const updated = addresses.filter((a) => a.id !== addrId);
    setAddresses(updated);
    storageService.set(STORAGE_KEYS.CUSTOMER_ADDRESSES, updated);
  };

  const setDefaultAddress = (addrId) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === addrId
    }));
    setAddresses(updated);
    storageService.set(STORAGE_KEYS.CUSTOMER_ADDRESSES, updated);
  };

  const isCustomer = user && user.role === 'customer';

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isCustomer,
        addresses,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  }
  return context;
}

