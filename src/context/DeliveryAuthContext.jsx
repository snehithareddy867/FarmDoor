import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { storageService, STORAGE_KEYS } from '../services/storage';

const DeliveryAuthContext = createContext(null);

export function DeliveryAuthProvider({ children }) {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState(true);

  useEffect(() => {
    // Only restore session if delivery role is active
    const activeRole = storageService.getActiveRole();
    const saved = storageService.getCurrentDeliveryPartner();
    if (saved && activeRole === 'delivery') {
      setPartner(saved);
      // Fetch latest profile from backend to ensure status is fresh
      const pid = saved.partnerId || saved.id || saved._id;
      if (pid) {
        api.getDeliveryProfile(pid).then((fresh) => {
          if (fresh && (fresh.verificationStatus || fresh.partnerId)) {
            setPartner(fresh);
            storageService.setCurrentDeliveryPartner(fresh);
          }
        }).catch(() => {});
      }
    } else {
      setPartner(null);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const res = await api.deliveryLogin(credentials);
    if (res.success) {
      storageService.setActiveRole('delivery');
      setPartner(res.partner);
      return res;
    }
    throw new Error('Delivery partner authentication failed.');
  };

  const register = async (formData) => {
    const res = await api.deliveryRegister(formData);
    if (res.success) {
      storageService.setActiveRole('delivery');
      setPartner(res.partner);
      return res;
    }
    throw new Error('Delivery partner registration failed.');
  };

  const logout = () => {
    setPartner(null);
    storageService.remove(STORAGE_KEYS.DELIVERY_USER);
    localStorage.removeItem('farmdoor_token');
    if (storageService.getActiveRole() === 'delivery') {
      storageService.clearActiveRole();
    }
  };

  const updateProfile = async (updates) => {
    if (!partner?.id) return;
    const current = partner || {};
    const updated = { ...current, ...updates };
    setPartner(updated);
    storageService.setCurrentDeliveryPartner(updated);
    storageService.updateDeliveryPartnerProfile(partner.id, updates);
    api.updateDeliveryProfile(partner.id, updates).catch(() => {});
    return updated;
  };

  const toggleOnline = async () => {
    if (!partner?.id) return;
    const newOnlineStatus = !partner.isOnline;
    const updates = {
      isOnline: newOnlineStatus,
      isAvailable: newOnlineStatus,
      // Rule E: Do not collect location when offline!
      currentLocation: newOnlineStatus
        ? partner.currentLocation || { lat: 18.5074, lng: 73.8077, address: 'Pune Central Eco Hub' }
        : null
    };
    await updateProfile(updates);
    return newOnlineStatus;
  };

  const toggleAvailability = async () => {
    if (!partner?.id || !partner.isOnline) return;
    const updates = { isAvailable: !partner.isAvailable };
    await updateProfile(updates);
  };

  const setServiceArea = async (area) => {
    if (!partner?.id) return;
    await updateProfile({ serviceArea: area });
  };

  const requestLocationPermission = () => {
    setLocationPermission(true);
    if (partner?.isOnline) {
      updateProfile({
        currentLocation: { lat: 18.5074, lng: 73.8077, address: 'Pune Fleet Staging Hub' }
      });
    }
  };

  const resubmitVerification = async (docs) => {
    const pid = partner?.partnerId || partner?.id;
    if (!pid) return;
    await api.resubmitDeliveryVerification(pid, docs);
    const refreshed = storageService.getDeliveryPartnerById(pid);
    setPartner(refreshed);
    return refreshed;
  };

  const toggleVerificationStatusForTesting = async (status) => {
    const pid = partner?.partnerId || partner?.id || partner?._id;
    const isApp = status === 'Approved';
    const updated = {
      ...(partner || {}),
      verificationStatus: status,
      isVerified: isApp,
      verificationBadge: isApp ? 'Verified Platform Courier' : (status === 'Pending' ? 'Under Review' : 'Rejected')
    };

    setPartner(updated);
    storageService.setCurrentDeliveryPartner(updated);

    if (pid) {
      try {
        await api.updateDeliveryProfile(pid, {
          verificationStatus: status,
          isVerified: isApp,
          verificationBadge: updated.verificationBadge
        });
      } catch (e) {
        console.warn('Backend courier status sync failed', e);
      }
    }

    return updated;
  };

  const isApproved = partner?.verificationStatus === 'Approved';
  const isOnline = !!partner?.isOnline;
  const isAvailable = !!partner?.isAvailable;

  return (
    <DeliveryAuthContext.Provider
      value={{
        partner,
        loading,
        isAuthenticated: !!partner,
        isApproved,
        isOnline,
        isAvailable,
        verificationStatus: partner?.verificationStatus || 'Pending',
        serviceArea: partner?.serviceArea || 'Pune Central & Kothrud',
        currentLocation: partner?.currentLocation || null,
        locationPermission,
        login,
        register,
        logout,
        updateProfile,
        toggleOnline,
        toggleAvailability,
        setServiceArea,
        requestLocationPermission,
        resubmitVerification,
        toggleVerificationStatusForTesting
      }}
    >
      {children}
    </DeliveryAuthContext.Provider>
  );
}

export function useDeliveryAuth() {
  const context = useContext(DeliveryAuthContext);
  if (!context) {
    throw new Error('useDeliveryAuth must be used within a DeliveryAuthProvider');
  }
  return context;
}

