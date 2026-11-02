import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCustomerAuth } from './CustomerAuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useCustomerAuth();
  const [notifications, setNotifications] = useState([]);

  const refreshNotifications = async () => {
    if (user?.id) {
      const data = await api.getNotifications(user.id);
      setNotifications(data || []);
    }
  };

  useEffect(() => {
    refreshNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    await api.markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = async () => {
    if (user?.id) {
      await api.markAllNotificationsAsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        refreshNotifications,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

