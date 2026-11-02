import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { storageService, STORAGE_KEYS } from '../services/storage';

const FarmerAuthContext = createContext(null);

export function FarmerAuthProvider({ children }) {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only restore session if farmer role is active
    const activeRole = storageService.getActiveRole();
    const saved = storageService.get(STORAGE_KEYS.FARMER_USER);
    if (saved && activeRole === 'farmer') {
      setFarmer(saved);
    } else {
      setFarmer(null);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const res = await api.farmerLogin(credentials);
    if (res.success) {
      storageService.setActiveRole('farmer');
      setFarmer(res.farmer);
      return res;
    }
    throw new Error('Farmer authentication failed.');
  };

  const register = async (formData) => {
    const res = await api.farmerRegister(formData);
    if (res.success) {
      storageService.setActiveRole('farmer');
      setFarmer(res.farmer);
      return res;
    }
    throw new Error('Farmer registration failed.');
  };

  const logout = () => {
    setFarmer(null);
    storageService.remove(STORAGE_KEYS.FARMER_USER);
    if (storageService.getActiveRole() === 'farmer') {
      storageService.clearActiveRole();
    }
  };

  const updateProfile = async (updates) => {
    const current = farmer || {};
    const updated = { ...current, ...updates };
    setFarmer(updated);
    storageService.set(STORAGE_KEYS.FARMER_USER, updated);
    
    // Also update in all farmers collection
    const allFarmers = storageService.getFarmers();
    const updatedAll = allFarmers.map((f) => (f.id === updated.id ? updated : f));
    storageService.set(STORAGE_KEYS.FARMERS, updatedAll);

    return updated;
  };

  const resubmitVerification = async (updatedData) => {
    if (farmer?.id) {
      await api.resubmitFarmerVerification(farmer.id, updatedData);
      const refreshed = storageService.getFarmerById(farmer.id);
      setFarmer(refreshed);
      return refreshed;
    }
  };

  const isApproved = farmer?.verificationStatus === 'Approved';
  const isFarmer = !!farmer;

  return (
    <FarmerAuthContext.Provider
      value={{
        farmer,
        loading,
        isAuthenticated: !!farmer,
        isFarmer,
        isApproved,
        verificationStatus: farmer?.verificationStatus || 'Pending',
        login,
        register,
        logout,
        updateProfile,
        resubmitVerification
      }}
    >
      {children}
    </FarmerAuthContext.Provider>
  );
}

export function useFarmerAuth() {
  const context = useContext(FarmerAuthContext);
  if (!context) {
    throw new Error('useFarmerAuth must be used within FarmerAuthProvider');
  }
  return context;
}

