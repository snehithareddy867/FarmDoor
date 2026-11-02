import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const activeRole = api.getActiveRole ? api.getActiveRole() : null;
      const current = api.getCurrentAdmin ? api.getCurrentAdmin() : null;
      if (current && activeRole === 'admin') {
        setAdmin(current);
      } else {
        setAdmin(null);
      }
    } catch (e) {
      console.error('Failed to load admin session', e);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (identifier, password) => {
    try {
      const result = await api.adminLogin(identifier, password);
      if (result.success) {
        if (api.setActiveRole) api.setActiveRole('admin');
        setAdmin(result.admin);
        return { success: true, admin: result.admin };
      }
      return { success: false, message: result.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Error occurred during login' };
    }
  };

  const logout = async () => {
    try {
      await api.adminLogout();
      if (api.clearActiveRole) api.clearActiveRole();
      setAdmin(null);
    } catch (err) {
      console.error('Admin logout error', err);
      setAdmin(null);
    }
  };

  const hasPermission = (permission) => {
    if (!admin) return false;
    if (admin.role === 'Super Admin' || (admin.permissions && admin.permissions.includes('ALL'))) {
      return true;
    }
    return admin.permissions && admin.permissions.includes(permission);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        loading,
        role: admin?.role || 'Guest',
        permissions: admin?.permissions || [],
        login,
        logout,
        hasPermission
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

