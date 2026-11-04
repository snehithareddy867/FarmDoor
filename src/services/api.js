// Unified API Client for Farm to Home (FarmDoor)
// Connects directly to Node.js Express + MongoDB backend endpoints
// Gracefully syncs with local storage for instant offline resilience

import { storageService, STORAGE_KEYS } from './storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.isBackendAvailable = false;
    this.checkBackendHealth();
  }

  getAuthHeaders() {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('farmdoor_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  async checkBackendHealth() {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { method: 'GET', signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        this.isBackendAvailable = true;
        return true;
      }
    } catch {
      this.isBackendAvailable = false;
    }
    return false;
  }

  // ==========================================
  // CUSTOMER AUTH METHODS
  // ==========================================

  async login({ emailOrPhone, password }) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/auth/login`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ emailOrPhone, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.token) localStorage.setItem('farmdoor_token', data.token);
          storageService.set(STORAGE_KEYS.CUSTOMER_USER, data.user);
          storageService.setActiveRole('customer');
          return data;
        } else {
          return { success: false, message: data.message || 'Invalid credentials. User not found or incorrect password.' };
        }
      } catch (err) {
        console.warn('Backend customer login error', err);
        return { success: false, message: 'Server communication error. Please ensure database and server are running.' };
      }
    }

    return { success: false, message: 'Unable to reach backend database service. Please check your connection.' };
  }

  async register(registrationData) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/auth/register`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(registrationData)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.token) localStorage.setItem('farmdoor_token', data.token);
          storageService.set(STORAGE_KEYS.CUSTOMER_USER, data.user);
          storageService.setActiveRole('customer');
          return data;
        } else {
          return { success: false, message: data.message || 'Registration failed. Please check inputs.' };
        }
      } catch (err) {
        console.warn('Backend register error', err);
        return { success: false, message: 'Server communication error during registration.' };
      }
    }

    return { success: false, message: 'Unable to reach backend database service. Please check your connection.' };
  }

  async getCurrentUser() {
    return storageService.get(STORAGE_KEYS.CUSTOMER_USER);
  }

  async updateProfile(updates) {
    const current = storageService.get(STORAGE_KEYS.CUSTOMER_USER) || {};
    const updated = { ...current, ...updates };
    storageService.set(STORAGE_KEYS.CUSTOMER_USER, updated);
    return updated;
  }

  // ==========================================
  // PRODUCTS APIS
  // ==========================================

  async getProducts(params = {}) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${this.baseUrl}/products?${query}`);
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      } catch (err) {
        console.warn('Backend products fetch failed, using local repository', err);
      }
    }

    await new Promise((r) => setTimeout(r, 100));
    let list = storageService.getProducts();

    if (params.category && params.category !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.farmerName?.toLowerCase().includes(q) ||
        p.farmLocation?.toLowerCase().includes(q)
      );
    }
    if (params.farmerId) {
      list = list.filter((p) => p.farmerId === params.farmerId);
    }
    if (params.inStockOnly) {
      list = list.filter((p) => p.availableQuantity > 0);
    }
    if (params.minPrice) {
      list = list.filter((p) => p.price >= parseFloat(params.minPrice));
    }
    if (params.maxPrice) {
      list = list.filter((p) => p.price <= parseFloat(params.maxPrice));
    }

    return { products: list, total: list.length };
  }

  async getProductById(id) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/products/${id}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend product fetch failed', err);
      }
    }
    return storageService.getProductById(id);
  }

  // ==========================================
  // FARMER PUBLIC DIRECTORY
  // ==========================================

  async getFarmers() {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/farmer/all`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend farmers fetch failed', err);
      }
    }
    return storageService.getFarmers();
  }

  async getFarmerById(id) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/farmer/${id}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend farmer fetch failed', err);
      }
    }
    return storageService.getFarmerById(id);
  }

  // ==========================================
  // ORDERS APIS
  // ==========================================

  async createOrder(orderData) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/orders`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(orderData)
        });
        if (res.ok) {
          const data = await res.json();
          // Keep local storage copy updated
          if (data.order) {
            const currentOrders = storageService.getOrders(data.order.customerId) || [];
            currentOrders.unshift(data.order);
            storageService.set(STORAGE_KEYS.ORDERS, currentOrders);
          }
          return data.order || data;
        }
      } catch (err) {
        console.warn('Backend order creation failed, using storageService', err);
      }
    }

    await new Promise((r) => setTimeout(r, 350));
    return storageService.createOrder(orderData);
  }

  async getOrders(customerId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const url = customerId ? `${this.baseUrl}/orders?customerId=${customerId}` : `${this.baseUrl}/orders`;
        const res = await fetch(url, { headers: this.getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend orders fetch failed', err);
      }
    }
    return storageService.getOrders(customerId);
  }

  async getOrderById(orderId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/orders/${orderId}`, { headers: this.getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend order fetch failed', err);
      }
    }
    return storageService.getOrderById(orderId);
  }

  async cancelOrder(orderId, reason) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/orders/${orderId}/cancel`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ reason })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          storageService.cancelOrder(orderId, reason);
          return data;
        } else if (!res.ok) {
          return { success: false, message: data.message || 'Failed to cancel order' };
        }
      } catch (err) {
        console.warn('Backend order cancel failed', err);
      }
    }
    return storageService.cancelOrder(orderId, reason);
  }

  // ==========================================
  // REVIEWS & NOTIFICATIONS
  // ==========================================

  async getReviews(productId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/reviews?productId=${productId}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend reviews fetch failed', err);
      }
    }
    return storageService.getReviews(productId);
  }

  async addReview(reviewData) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/reviews`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(reviewData)
        });
        if (res.ok) {
          const data = await res.json();
          storageService.addReview(data.review || reviewData);
          return data.review || data;
        }
      } catch (err) {
        console.warn('Backend add review failed', err);
      }
    }
    return storageService.addReview(reviewData);
  }

  async deleteReview(reviewId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/reviews/${reviewId}`, {
          method: 'DELETE',
          headers: this.getAuthHeaders()
        });
        if (res.ok) {
          storageService.deleteReview(reviewId);
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend delete review failed', err);
      }
    }
    return storageService.deleteReview(reviewId);
  }

  async getNotifications(customerId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/notifications?userId=${customerId}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend notifications fetch failed', err);
      }
    }
    return storageService.getNotifications(customerId);
  }

  async markNotificationAsRead(id) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        await fetch(`${this.baseUrl}/notifications/${id}/read`, { method: 'PUT', headers: this.getAuthHeaders() });
      } catch (err) {
        console.warn('Backend notification mark read failed', err);
      }
    }
    return storageService.markNotificationAsRead(id);
  }

  async markAllNotificationsAsRead(customerId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        await fetch(`${this.baseUrl}/notifications/read-all`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ userId: customerId })
        });
      } catch (err) {
        console.warn('Backend mark all read failed', err);
      }
    }
    return storageService.markAllNotificationsAsRead(customerId);
  }

  async getComplaints(customerId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/complaints?userId=${customerId}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend complaints fetch failed', err);
      }
    }
    return storageService.getComplaints(customerId);
  }

  async submitComplaint(complaintData) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/complaints`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(complaintData)
        });
        if (res.ok) {
          const data = await res.json();
          storageService.addComplaint(data.complaint || complaintData);
          return data.complaint || data;
        }
      } catch (err) {
        console.warn('Backend submit complaint failed', err);
      }
    }
    return storageService.addComplaint(complaintData);
  }

  // ==========================================
  // FARMER MODULE APIS
  // ==========================================

  async farmerLogin({ emailOrPhone, password }) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/farmer/auth/login`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ emailOrPhone, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.token) localStorage.setItem('farmdoor_token', data.token);
          storageService.set(STORAGE_KEYS.FARMER_USER, data.farmer);
          storageService.setActiveRole('farmer');
          return data;
        }
      } catch (err) {
        console.warn('Backend farmer login failed, using local auth', err);
      }
    }

    return { success: false, message: 'Invalid farmer credentials or account not found. Please verify your credentials or register.' };
  }

  async farmerRegister(farmerData) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/farmer/auth/register`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(farmerData)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.token) localStorage.setItem('farmdoor_token', data.token);
          storageService.set(STORAGE_KEYS.FARMER_USER, data.farmer);
          storageService.setActiveRole('farmer');
          return data;
        }
      } catch (err) {
        console.warn('Backend farmer register failed', err);
      }
    }

    await new Promise((r) => setTimeout(r, 400));
    const newFarmer = {
      id: `farmer-${Date.now()}`,
      name: farmerData.fullName,
      farmName: farmerData.farmName,
      location: `${farmerData.district}, ${farmerData.state}`,
      phone: farmerData.mobile,
      email: farmerData.email,
      isVerified: false,
      verificationStatus: 'Pending',
      verificationBadge: 'Verification Under Review',
      adminFeedback: 'Application under verification.'
    };

    storageService.set(STORAGE_KEYS.FARMER_USER, newFarmer);
    storageService.setActiveRole('farmer');
    return { success: true, farmer: newFarmer, token: 'mock-jwt-farmer-token' };
  }

  async getFarmerProducts(farmerId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/farmer/products?farmerId=${farmerId}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend getFarmerProducts failed', err);
      }
    }
    return storageService.getFarmerProducts(farmerId);
  }

  async createFarmerProduct(productData) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/farmer/products`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(productData)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          storageService.createFarmerProduct(data.product || productData);
          return data.product || data;
        } else if (!res.ok) {
          throw new Error(data.message || 'Product creation failed');
        }
      } catch (err) {
        console.warn('Backend product creation failed', err);
        throw err;
      }
    }
    return storageService.createFarmerProduct(productData);
  }

  async updateFarmerProduct(productId, updates) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/farmer/products/${productId}`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(updates)
        });
        if (res.ok) {
          const data = await res.json();
          storageService.updateFarmerProduct(productId, updates);
          return data.product || data;
        }
      } catch (err) {
        console.warn('Backend product update failed', err);
      }
    }
    return storageService.updateFarmerProduct(productId, updates);
  }

  async deleteFarmerProduct(productId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/farmer/products/${productId}`, {
          method: 'DELETE',
          headers: this.getAuthHeaders()
        });
        if (res.ok) {
          storageService.deleteFarmerProduct(productId);
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend product delete failed', err);
      }
    }
    return storageService.deleteFarmerProduct(productId);
  }

  async getFarmerOrders(farmerId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/farmer/orders?farmerId=${farmerId}`, {
          headers: this.getAuthHeaders()
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend farmer orders fetch failed', err);
      }
    }
    return storageService.getFarmerOrders(farmerId);
  }

  async updateOrderStatusByFarmer(orderId, newStatus, note, deliveryData) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/farmer/orders/${orderId}/status`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ status: newStatus, note, deliveryData })
        });
        if (res.ok) {
          const data = await res.json();
          storageService.updateOrderStatusByFarmer(orderId, newStatus, note, deliveryData);
          return data.order || data;
        }
      } catch (err) {
        console.warn('Backend order status update failed', err);
      }
    }
    return storageService.updateOrderStatusByFarmer(orderId, newStatus, note, deliveryData);
  }

  async getFarmerEarnings(farmerId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/farmer/earnings?farmerId=${farmerId}`, {
          headers: this.getAuthHeaders()
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend earnings fetch failed', err);
      }
    }
    return storageService.getFarmerEarnings(farmerId);
  }

  async getStockHistory(farmerId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/farmer/stock-history?farmerId=${farmerId}`, {
          headers: this.getAuthHeaders()
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend stock history fetch failed', err);
      }
    }
    return storageService.getStockHistory(farmerId);
  }

  async updateStockWithHistory(productId, newQty, reason, farmerId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/farmer/stock-adjust`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            productId,
            newQuantity: Number(newQty),
            reason,
            farmerId,
            type: 'manual_adjustment'
          })
        });
        if (res.ok) {
          const data = await res.json();
          storageService.updateStockWithHistory(productId, newQty, reason, farmerId);
          return data;
        }
      } catch (err) {
        console.warn('Backend stock adjust failed', err);
      }
    }
    return storageService.updateStockWithHistory(productId, newQty, reason, farmerId);
  }

  async getFarmerProfile(farmerId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/farmer/profile/${farmerId}`, {
          headers: this.getAuthHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (data.farmer) {
            storageService.set(STORAGE_KEYS.FARMER_USER, data.farmer);
            return data.farmer;
          }
          return data;
        }
      } catch (err) {
        console.warn('Backend farmer profile fetch failed', err);
      }
    }
    return storageService.getFarmerById(farmerId);
  }

  async addFarmerReply(reviewId, text) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/reviews/${reviewId}/reply`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ text })
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend farmer reply failed', err);
      }
    }
    return storageService.addFarmerReplyToReview(reviewId, text);
  }

  async getFarmerReviews(farmerId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/reviews?farmerId=${farmerId}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend farmer reviews fetch failed', err);
      }
    }
    return storageService.getFarmerReviews(farmerId);
  }

  async resubmitFarmerVerification(farmerId, updatedData) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/farmer/profile/${farmerId}`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            verificationStatus: 'Pending',
            verificationBadge: 'Verification Under Review',
            adminFeedback: 'Resubmitted for administrative verification.',
            ...updatedData
          })
        });
        if (res.ok) {
          const data = await res.json();
          storageService.resubmitFarmerVerification(farmerId, updatedData);
          return data.farmer || data;
        }
      } catch (err) {
        console.warn('Backend resubmit verification failed', err);
      }
    }
    return storageService.resubmitFarmerVerification(farmerId, updatedData);
  }

  async setFarmerVerificationStatus(farmerId, status, feedback) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const endpoint = status === 'Approved' ? 'approve' : (status === 'Pending' ? 'pending' : 'reject');
        const res = await fetch(`${this.baseUrl}/admin/farmers/${farmerId}/${endpoint}`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ notes: feedback, reason: feedback })
        });
        if (res.ok) {
          storageService.setFarmerVerificationStatus(farmerId, status, feedback);
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend set verification status failed', err);
      }
    }
    return storageService.setFarmerVerificationStatus(farmerId, status, feedback);
  }

  async updateFarmerProfile(farmerId, updates) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/farmer/profile/${farmerId}`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(updates)
        });
        if (res.ok) {
          storageService.updateFarmerProfile(farmerId, updates);
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend update farmer profile failed', err);
      }
    }
    return storageService.updateFarmerProfile(farmerId, updates);
  }

  async getFarmerTickets(farmerId) {
    return storageService.getFarmerTickets(farmerId);
  }

  async createFarmerTicket(data) {
    return storageService.createFarmerTicket(data);
  }

  // ==========================================
  // DELIVERY PARTNER APIS
  // ==========================================

  async deliveryLogin({ emailOrPhone, password }) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/delivery/login`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ emailOrPhone, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.token) localStorage.setItem('farmdoor_token', data.token);
          storageService.setCurrentDeliveryPartner(data.partner);
          storageService.setActiveRole('delivery');
          return data;
        }
      } catch (err) {
        console.warn('Backend delivery login failed, using local auth', err);
      }
    }

    return { success: false, message: 'Invalid courier credentials or account not found. Please verify your credentials or register.' };
  }

  async deliveryRegister(data) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/delivery/register`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(data)
        });
        const respData = await res.json();
        if (res.ok && respData.success) {
          if (respData.token) localStorage.setItem('farmdoor_token', respData.token);
          storageService.setCurrentDeliveryPartner(respData.partner);
          storageService.setActiveRole('delivery');
          return respData;
        }
      } catch (err) {
        console.warn('Backend delivery register failed, using local fallback', err);
      }
    }

    await new Promise((r) => setTimeout(r, 400));
    const newPartner = storageService.saveDeliveryPartner(data);
    storageService.setActiveRole('delivery');
    return { success: true, partner: newPartner, token: 'mock-jwt-delivery-token' };
  }

  async getDeliveryProfile(partnerId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/delivery/profile/${partnerId}`, {
          headers: this.getAuthHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (data.partner) {
            storageService.setCurrentDeliveryPartner(data.partner);
            return data.partner;
          }
          return data;
        }
      } catch (err) {
        console.warn('Backend delivery profile fetch failed', err);
      }
    }
    return storageService.getDeliveryPartnerById(partnerId);
  }

  async updateDeliveryProfile(partnerId, updates) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/delivery/profile/${partnerId}`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(updates)
        });
        if (res.ok) {
          storageService.updateDeliveryPartnerProfile(partnerId, updates);
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend update delivery profile failed', err);
      }
    }
    return storageService.updateDeliveryPartnerProfile(partnerId, updates);
  }

  async getAvailableDeliveryRequests(partnerId, serviceArea) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/delivery/requests?partnerId=${partnerId}&serviceArea=${serviceArea || ''}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend available requests fetch failed', err);
      }
    }
    return storageService.getAvailableDeliveryJobs(partnerId, serviceArea);
  }

  async getPartnerActiveDeliveries(partnerId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/delivery/active?partnerId=${partnerId}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend active deliveries fetch failed', err);
      }
    }
    return storageService.getPartnerActiveDeliveries(partnerId);
  }

  async getPartnerDeliveryHistory(partnerId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/delivery/history?partnerId=${partnerId}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend history fetch failed', err);
      }
    }
    return storageService.getPartnerDeliveryHistory(partnerId);
  }

  async acceptDeliveryJob(jobId, partnerId, partnerName) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/delivery/jobs/${jobId}/accept`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ partnerId, partnerName })
        });
        if (res.ok) {
          const data = await res.json();
          storageService.acceptDeliveryJob(jobId, partnerId, partnerName);
          return data;
        }
      } catch (err) {
        console.warn('Backend accept delivery job failed', err);
      }
    }
    return storageService.acceptDeliveryJob(jobId, partnerId, partnerName);
  }

  async rejectDeliveryJob(jobId, partnerId, reason) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/delivery/jobs/${jobId}/reject`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ partnerId, reason })
        });
        if (res.ok) {
          storageService.rejectDeliveryJob(jobId, partnerId, reason);
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend reject delivery job failed', err);
      }
    }
    return storageService.rejectDeliveryJob(jobId, partnerId, reason);
  }

  async updateDeliveryWorkflow(jobId, newStatus, note) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/delivery/jobs/${jobId}/workflow`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ status: newStatus, note })
        });
        if (res.ok) {
          const data = await res.json();
          storageService.updateDeliveryWorkflow(jobId, newStatus, note);
          return data;
        }
      } catch (err) {
        console.warn('Backend workflow update failed', err);
      }
    }
    return storageService.updateDeliveryWorkflow(jobId, newStatus, note);
  }

  async confirmPickup(jobId, checklist, damagedReport) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/delivery/jobs/${jobId}/pickup`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ checklist, damagedReport })
        });
        if (res.ok) {
          const data = await res.json();
          storageService.confirmPickup(jobId, checklist, damagedReport);
          return data;
        }
      } catch (err) {
        console.warn('Backend confirm pickup failed', err);
      }
    }
    return storageService.confirmPickup(jobId, checklist, damagedReport);
  }

  async confirmDelivery(jobId, payload) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/delivery/jobs/${jobId}/deliver`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ proofOfDelivery: payload })
        });
        if (res.ok) {
          const data = await res.json();
          storageService.confirmDelivery(jobId, payload);
          return data;
        }
      } catch (err) {
        console.warn('Backend confirm delivery failed', err);
      }
    }
    return storageService.confirmDelivery(jobId, payload);
  }

  async reportDeliveryFailure(jobId, payload) {
    return storageService.reportDeliveryFailure(jobId, payload);
  }

  async getDeliveryPartnerEarnings(partnerId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/delivery/earnings/${partnerId}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend partner earnings fetch failed', err);
      }
    }
    return storageService.getDeliveryPartnerEarnings(partnerId);
  }

  async getDeliveryNotifications(partnerId) {
    return storageService.getDeliveryNotifications(partnerId);
  }

  async markDeliveryNotificationRead(id) {
    return storageService.markDeliveryNotificationRead(id);
  }

  async clearDeliveryNotifications(partnerId) {
    return storageService.clearDeliveryNotifications(partnerId);
  }

  async submitDeliveryTicket(ticketData) {
    return storageService.submitDeliveryTicket(ticketData);
  }

  async getDeliveryTickets(partnerId) {
    return storageService.getDeliveryTickets(partnerId);
  }

  async setDeliveryPartnerVerification(partnerId, status, feedback) {
    return storageService.setDeliveryPartnerVerification(partnerId, status, feedback);
  }

  async resubmitDeliveryVerification(partnerId, updatedDocs) {
    return storageService.resubmitDeliveryVerification(partnerId, updatedDocs);
  }

  // ==========================================
  // ADMIN CONSOLE APIS (CONNECTED TO MONGODB)
  // ==========================================

  async getAdminAccounts() {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/accounts`, { headers: this.getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend admin accounts fetch failed', err);
      }
    }
    return storageService.getAdminAccounts();
  }

  async getCurrentAdmin() {
    return storageService.getCurrentAdmin();
  }

  async setCurrentAdmin(admin) {
    return storageService.setCurrentAdmin(admin);
  }

  async adminLogin(identifier, password) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/auth/login`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ identifier, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.token) localStorage.setItem('farmdoor_token', data.token);
          storageService.setCurrentAdmin(data.admin);
          storageService.setActiveRole('admin');
          return data;
        }
      } catch (err) {
        console.warn('Backend admin login failed, fallback to local', err);
      }
    }
    return storageService.adminLogin(identifier, password);
  }

  async adminLogout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('farmdoor_token');
    }
    return storageService.adminLogout();
  }

  async updateAdminProfile(adminId, updates) {
    return storageService.updateAdminProfile(adminId, updates);
  }

  async getAdminDashboardStats() {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/stats`, { headers: this.getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend admin stats fetch failed', err);
      }
    }
    return storageService.getAdminDashboardStats();
  }

  async getAllFarmersAdmin() {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/farmers`, { headers: this.getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend admin farmers fetch failed', err);
      }
    }
    return storageService.getAllFarmersAdmin();
  }

  async adminApproveFarmer(farmerId, notes, actor) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/farmers/${farmerId}/approve`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ notes, actor })
        });
        if (res.ok) {
          const data = await res.json();
          storageService.adminApproveFarmer(farmerId, notes, actor);
          return data;
        }
      } catch (err) {
        console.warn('Backend admin farmer approve failed', err);
      }
    }
    return storageService.adminApproveFarmer(farmerId, notes, actor);
  }

  async adminRejectFarmer(farmerId, reason, actor) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/farmers/${farmerId}/reject`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ reason, actor })
        });
        if (res.ok) {
          const data = await res.json();
          storageService.adminRejectFarmer(farmerId, reason, actor);
          return data;
        }
      } catch (err) {
        console.warn('Backend admin farmer reject failed', err);
      }
    }
    return storageService.adminRejectFarmer(farmerId, reason, actor);
  }

  async adminToggleFarmerSuspension(farmerId, justification, actor) {
    return storageService.adminToggleFarmerSuspension(farmerId, justification, actor);
  }

  async getCustomers() {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/customers`, { headers: this.getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend admin customers fetch failed', err);
      }
    }
    return storageService.getCustomers();
  }

  async adminToggleCustomerSuspension(customerId, justification, actor) {
    return storageService.adminToggleCustomerSuspension(customerId, justification, actor);
  }

  async getAllDeliveryPartnersAdmin() {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/delivery-partners`, { headers: this.getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend admin delivery partners fetch failed', err);
      }
    }
    return storageService.getAllDeliveryPartnersAdmin();
  }

  async adminApproveDeliveryPartner(partnerId, notes, actor) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/delivery-partners/${partnerId}/approve`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ notes, actor })
        });
        if (res.ok) {
          const data = await res.json();
          storageService.adminApproveDeliveryPartner(partnerId, notes, actor);
          return data;
        }
      } catch (err) {
        console.warn('Backend admin approve partner failed', err);
      }
    }
    return storageService.adminApproveDeliveryPartner(partnerId, notes, actor);
  }

  async adminRejectDeliveryPartner(partnerId, reason, actor) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/delivery-partners/${partnerId}/reject`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ reason, actor })
        });
        if (res.ok) {
          const data = await res.json();
          storageService.adminRejectDeliveryPartner(partnerId, reason, actor);
          return data;
        }
      } catch (err) {
        console.warn('Backend admin reject partner failed', err);
      }
    }
    return storageService.adminRejectDeliveryPartner(partnerId, reason, actor);
  }

  async adminTogglePartnerSuspension(partnerId, justification, actor) {
    return storageService.adminTogglePartnerSuspension(partnerId, justification, actor);
  }

  async getAllProductsAdmin() {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/products`, { headers: this.getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend admin products fetch failed', err);
      }
    }
    return storageService.getAllProductsAdmin();
  }

  async adminApproveProduct(productId, actor) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/products/${productId}/approve`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ actor })
        });
        if (res.ok) {
          const data = await res.json();
          storageService.adminApproveProduct(productId, actor);
          return data;
        }
      } catch (err) {
        console.warn('Backend admin approve product failed', err);
      }
    }
    return storageService.adminApproveProduct(productId, actor);
  }

  async adminRejectProduct(productId, reason, actor) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/products/${productId}/reject`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ reason, actor })
        });
        if (res.ok) {
          const data = await res.json();
          storageService.adminRejectProduct(productId, reason, actor);
          return data;
        }
      } catch (err) {
        console.warn('Backend admin reject product failed', err);
      }
    }
    return storageService.adminRejectProduct(productId, reason, actor);
  }

  async adminRemoveProduct(productId, reason, actor) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/products/${productId}`, {
          method: 'DELETE',
          headers: this.getAuthHeaders()
        });
        if (res.ok) {
          storageService.adminRemoveProduct(productId, reason, actor);
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend admin delete product failed', err);
      }
    }
    return storageService.adminRemoveProduct(productId, reason, actor);
  }

  async adminToggleSupplierVerification(productId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/products/${productId}/toggle-supplier`, {
          method: 'PUT',
          headers: this.getAuthHeaders()
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend toggle supplier verification failed', err);
      }
    }
    return { success: true };
  }

  async adminCreateProduct(productData) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/products`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(productData)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend admin create product failed', err);
      }
    }
    return { success: false, message: 'Backend unavailable' };
  }

  async adminUpdateProduct(productId, updates) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/products/${productId}`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(updates)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend admin update product failed', err);
      }
    }
    return { success: false, message: 'Backend unavailable' };
  }

  async getCategories() {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/categories`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend categories fetch failed', err);
      }
    }
    return storageService.getCategories();
  }

  async adminAddCategory(categoryData, actor) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/categories`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(categoryData)
        });
        if (res.ok) {
          const data = await res.json();
          storageService.adminAddCategory(data.category || categoryData, actor);
          return data;
        }
      } catch (err) {
        console.warn('Backend add category failed', err);
      }
    }
    return storageService.adminAddCategory(categoryData, actor);
  }

  async adminUpdateCategory(categoryId, categoryData, actor) {
    return storageService.adminUpdateCategory(categoryId, categoryData, actor);
  }

  async adminToggleCategoryStatus(categoryId, actor) {
    return storageService.adminToggleCategoryStatus(categoryId, actor);
  }

  async adminDeleteCategory(categoryId, actor) {
    return storageService.adminDeleteCategory(categoryId, actor);
  }

  async getAllOrdersAdmin() {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/orders`, { headers: this.getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend admin orders fetch failed', err);
      }
    }
    return storageService.getAllOrdersAdmin();
  }

  async adminCancelOrder(orderId, payload) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/orders/${orderId}/cancel`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          storageService.adminCancelOrder(orderId, payload);
          return data;
        } else if (!res.ok) {
          return { success: false, message: data.message || 'Failed to cancel order' };
        }
      } catch (err) {
        console.warn('Backend admin cancel order failed', err);
      }
    }
    return storageService.adminCancelOrder(orderId, payload);
  }

  async adminReassignDelivery(orderId, newPartnerId, actor) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/orders/${orderId}/reassign-delivery`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ newPartnerId, actor })
        });
        if (res.ok) {
          const data = await res.json();
          storageService.adminReassignDelivery(orderId, newPartnerId, actor);
          return data;
        }
      } catch (err) {
        console.warn('Backend admin reassign delivery failed', err);
      }
    }
    return storageService.adminReassignDelivery(orderId, newPartnerId, actor);
  }

  // ==========================================
  // RAZORPAY PAYMENT GATEWAY METHODS
  // ==========================================

  async getPaymentConfig() {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/payment/config`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Failed to fetch payment config', err);
      }
    }
    return { success: true, configured: true, keyId: 'rzp_test_FarmDoor2026Demo', currency: 'INR' };
  }

  async createRazorpayOrder(payload) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/payment/create-order`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend create payment order failed', err);
      }
    }
    return {
      success: true,
      orderId: `order_test_${Date.now()}`,
      amount: Math.round(Number(payload.amount || 0) * 100),
      currency: 'INR',
      keyId: 'rzp_test_FarmDoor2026Demo',
      configured: true,
      isSimulated: true
    };
  }

  async verifyRazorpayPayment(payload) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/payment/verify`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend verify payment failed', err);
      }
    }
    return {
      success: true,
      verified: true,
      payment: {
        transactionId: payload.razorpay_payment_id || `pay_sim_${Date.now()}`,
        orderId: payload.orderNumber,
        amount: payload.amount,
        status: 'Success'
      }
    };
  }

  async getPaymentHistory(customerId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const url = customerId
          ? `${this.baseUrl}/payment/history?customerId=${customerId}`
          : `${this.baseUrl}/payment/history`;
        const res = await fetch(url, { headers: this.getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend payment history fetch failed', err);
      }
    }
    return [];
  }

  async getAllPaymentsAdmin() {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/payment/all`, { headers: this.getAuthHeaders() });
        if (res.ok) {
          const data = await res.json();
          return data.payments || data;
        }
      } catch (err) {
        console.warn('Backend admin payments fetch failed', err);
      }
    }
    return storageService.getAllPaymentsAdmin();
  }

  async adminProcessRefund(orderId, payload) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/payment/refund/${orderId}`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend process refund failed', err);
      }
    }
    return storageService.adminProcessRefund(orderId, payload);
  }

  // ==========================================
  // WISHLIST METHODS
  // ==========================================

  async getWishlist(userId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/wishlist/${userId}`, { headers: this.getAuthHeaders() });
        if (res.ok) {
          const data = await res.json();
          return data.wishlist?.items || [];
        }
      } catch (err) {
        console.warn('Backend wishlist fetch failed', err);
      }
    }
    return [];
  }

  async addToWishlist(userId, item) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/wishlist/${userId}/add`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(item)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend add to wishlist failed', err);
      }
    }
    return { success: true };
  }

  async removeFromWishlist(userId, productId) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/wishlist/${userId}/remove/${productId}`, {
          method: 'DELETE',
          headers: this.getAuthHeaders()
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend remove from wishlist failed', err);
      }
    }
    return { success: true };
  }

  async getAllComplaints() {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/complaints`, { headers: this.getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend admin complaints fetch failed', err);
      }
    }
    return storageService.getAllComplaints();
  }

  async adminAssignComplaint(complaintId, assignedTo, actor) {
    return storageService.adminAssignComplaint(complaintId, assignedTo, actor);
  }

  async adminResolveComplaint(complaintId, payload) {
    return storageService.adminResolveComplaint(complaintId, payload);
  }

  // ==========================================
  // COUPON VALIDATION
  // ==========================================

  async validateCoupon(code, cartTotal) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/coupons/validate`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ code, cartTotal })
        });
        const data = await res.json();
        return data;
      } catch (err) {
        console.warn('Backend coupon validate failed', err);
      }
    }
    const upper = (code || '').toUpperCase().trim();
    if (upper === 'FARMFRESH') {
      return { success: true, message: '15% Farm Fresh discount applied!', coupon: { code: 'FARMFRESH', discountPercent: 15, discountAmount: Math.round(cartTotal * 0.15) } };
    }
    return { success: false, message: 'Invalid or expired coupon' };
  }

  // ==========================================
  // PLATFORM SETTINGS & AUDIT LOGS
  // ==========================================

  async getPlatformSettings() {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/settings`, { headers: this.getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend settings fetch failed', err);
      }
    }
    return storageService.getPlatformSettings();
  }

  async updatePlatformSettings(newSettings, actor) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/settings`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ ...newSettings, actor })
        });
        if (res.ok) {
          const data = await res.json();
          storageService.updatePlatformSettings(newSettings, actor);
          return data;
        }
      } catch (err) {
        console.warn('Backend settings update failed', err);
      }
    }
    return storageService.updatePlatformSettings(newSettings, actor);
  }

  async getBroadcastAnnouncements() {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/notifications/broadcasts`, { headers: this.getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend broadcast fetch failed', err);
      }
    }
    return storageService.getBroadcastAnnouncements();
  }

  async createBroadcastAnnouncement(payload, actor) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/notifications/broadcast`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ ...payload, actor })
        });
        if (res.ok) {
          const data = await res.json();
          storageService.createBroadcastAnnouncement(payload, actor);
          return data;
        }
      } catch (err) {
        console.warn('Backend broadcast create failed', err);
      }
    }
    return storageService.createBroadcastAnnouncement(payload, actor);
  }

  async getAuditLogs(category, search) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const params = new URLSearchParams();
        if (category && category !== 'All') params.append('category', category);
        if (search) params.append('search', search);
        const res = await fetch(`${this.baseUrl}/admin/audit-logs?${params.toString()}`, { headers: this.getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend audit logs fetch failed', err);
      }
    }
    return storageService.getAuditLogs();
  }

  async logAdminAuditAction(payload) {
    if (this.isBackendAvailable || (await this.checkBackendHealth())) {
      try {
        const res = await fetch(`${this.baseUrl}/admin/audit-logs`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend log audit action failed', err);
      }
    }
    return storageService.logAdminAuditAction(payload);
  }

  // ==========================================
  // AGRICULTURAL CATALOGUE & APIS
  // ==========================================

  async getCatalogueProducts(options = {}) {
    try {
      const params = new URLSearchParams();
      if (options.category) params.append('category', options.category);
      if (options.search) params.append('search', options.search);
      if (options.season) params.append('season', options.season);
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);

      const res = await fetch(`${this.baseUrl}/catalogue?${params.toString()}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Catalogue fetch error:', err);
    }
    return { success: false, items: [], total: 0 };
  }

  async getCatalogueProductById(id) {
    try {
      const res = await fetch(`${this.baseUrl}/catalogue/${id}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Catalogue item fetch error:', err);
    }
    return { success: false, catalogueItem: null, activeFarmerListings: [] };
  }

  async searchCatalogue(query) {
    try {
      const res = await fetch(`${this.baseUrl}/catalogue/search?q=${encodeURIComponent(query)}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Catalogue search error:', err);
    }
    return { success: false, results: [] };
  }

  async searchPlants(query) {
    try {
      const res = await fetch(`${this.baseUrl}/agriculture/plants/search?q=${encodeURIComponent(query)}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Plant search error:', err);
    }
    return { success: false, data: [] };
  }

  async searchFoodNutrition(query) {
    try {
      const res = await fetch(`${this.baseUrl}/agriculture/food/search?q=${encodeURIComponent(query)}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Nutrition search error:', err);
    }
    return { success: false, data: [] };
  }

  async searchWikimediaImages(query) {
    try {
      const res = await fetch(`${this.baseUrl}/agriculture/images/search?q=${encodeURIComponent(query)}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Wikimedia images search error:', err);
    }
    return { success: false, data: [] };
  }

  async getMandiPrices(commodity, state = '') {
    try {
      let url = `${this.baseUrl}/agriculture/market-prices?commodity=${encodeURIComponent(commodity)}`;
      if (state) url += `&state=${encodeURIComponent(state)}`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Mandi prices fetch error:', err);
    }
    return { success: false, data: [], summary: null };
  }

  async compareMandiPrice(commodity, farmerPrice, state = '') {
    try {
      let url = `${this.baseUrl}/agriculture/market-prices/${encodeURIComponent(commodity)}?farmerPrice=${farmerPrice || ''}`;
      if (state) url += `&state=${encodeURIComponent(state)}`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Mandi price comparison error:', err);
    }
    return { success: false, comparison: null };
  }

  async uploadFarmerImage(imagePayload, farmerId = 'general') {
    try {
      const res = await fetch(`${this.baseUrl}/farmer/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ image: imagePayload, farmerId })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Farmer image upload error:', err);
    }
    return { success: false, message: 'Upload failed' };
  }

  async attachFarmerProductImage(productId, imagePayload, farmerId = 'general') {
    try {
      const res = await fetch(`${this.baseUrl}/farmer/products/${productId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ image: imagePayload, farmerId })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Attach product image error:', err);
    }
    return { success: false, message: 'Failed to attach image' };
  }

  async deleteFarmerProductImage(productId, imageId) {
    try {
      const res = await fetch(`${this.baseUrl}/farmer/products/${productId}/images/${imageId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Delete product image error:', err);
    }
    return { success: false, message: 'Failed to delete image' };
  }

  async getAdminCatalogue(options = {}) {
    try {
      const params = new URLSearchParams();
      if (options.category) params.append('category', options.category);
      if (options.search) params.append('search', options.search);
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      const res = await fetch(`${this.baseUrl}/admin/catalogue?${params.toString()}`, {
        headers: this.getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Admin catalogue fetch error:', err);
    }
    return { success: false, items: [], total: 0 };
  }

  async importAdminCatalogue(payload) {
    try {
      const res = await fetch(`${this.baseUrl}/admin/catalogue/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Admin catalogue import error:', err);
    }
    return { success: false, message: 'Import failed' };
  }

  async syncAdminCatalogueMandiPrices() {
    try {
      const res = await fetch(`${this.baseUrl}/admin/catalogue/sync`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Admin sync mandi prices error:', err);
    }
    return { success: false, message: 'Sync failed' };
  }

  async getAdminImageLicenseAudit() {
    try {
      const res = await fetch(`${this.baseUrl}/admin/images/audit`, {
        headers: this.getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Admin image license audit error:', err);
    }
    return { success: false, auditList: [] };
  }

  getActiveRole() {
    return storageService.getActiveRole();
  }

  setActiveRole(role) {
    return storageService.setActiveRole(role);
  }

  clearActiveRole() {
    return storageService.clearActiveRole();
  }
}

export const api = new ApiService();
export default api;
