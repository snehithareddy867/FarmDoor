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
      // Fetch latest profile from backend to ensure status (Approved/Pending/Rejected) is fresh
      const fid = saved.farmerId || saved.id || saved._id;
      if (fid) {
        api.getFarmerProfile(fid).then((fresh) => {
          if (fresh && (fresh.verificationStatus || fresh.farmerId)) {
            setFarmer(fresh);
            storageService.set(STORAGE_KEYS.FARMER_USER, fresh);
          }
        }).catch(() => {});
      }
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
    localStorage.removeItem('farmdoor_token');
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
    const updatedAll = allFarmers.map((f) => ((f.farmerId === updated.farmerId || f.id === updated.id) ? updated : f));
    storageService.set(STORAGE_KEYS.FARMERS, updatedAll);

    const fid = updated.farmerId || updated.id || updated._id;
    if (fid) {
      try {
        await api.updateFarmerProfile(fid, updates);
      } catch (err) {
        console.warn('Backend updateFarmerProfile notice:', err.message);
      }
    }

    return updated;
  };

  const resubmitVerification = async (updatedData) => {
    const fid = farmer?.farmerId || farmer?.id;
    if (fid) {
      const res = await api.resubmitFarmerVerification(fid, updatedData);
      const updated = res?.farmer || res || { ...farmer, ...updatedData, verificationStatus: 'Pending' };
      setFarmer(updated);
      storageService.set(STORAGE_KEYS.FARMER_USER, updated);
      return updated;
    }
  };

  const toggleVerificationStatusForTesting = async (status) => {
    const fid = farmer?.farmerId || farmer?.id || farmer?._id;
    const isApp = status === 'Approved';
    const updated = {
      ...(farmer || {}),
      verificationStatus: status,
      isVerified: isApp,
      verificationBadge: isApp ? 'Verified Organic Grower' : (status === 'Pending' ? 'Verification Under Review' : 'Verification Rejected')
    };

    setFarmer(updated);
    storageService.set(STORAGE_KEYS.FARMER_USER, updated);

    if (fid) {
      try {
        await api.updateFarmerProfile(fid, {
          verificationStatus: status,
          isVerified: isApp,
          verificationBadge: updated.verificationBadge
        });
      } catch (e) {
        console.warn('Backend verification status sync failed', e);
      }
    }

    return updated;
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
        resubmitVerification,
        toggleVerificationStatusForTesting
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

