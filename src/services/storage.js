// Local Storage / Database Service for Farm to Home
// Pre-populates realistic database collections ready for MongoDB/Express API integration

const STORAGE_KEYS = {
  FARMERS: 'fth_farmers_db',
  PRODUCTS: 'fth_products_db',
  ORDERS: 'fth_orders_db',
  REVIEWS: 'fth_reviews_db',
  NOTIFICATIONS: 'fth_notifications_db',
  COMPLAINTS: 'fth_complaints_db',
  CUSTOMER_USER: 'fth_current_customer',
  CUSTOMER_ADDRESSES: 'fth_customer_addresses',
  FARMER_USER: 'fth_current_farmer',
  STOCK_HISTORY: 'fth_stock_history',
  WISHLIST: 'fth_wishlist',
  CART: 'fth_cart',
  DELIVERY_PARTNERS: 'fth_delivery_partners_db',
  DELIVERY_ASSIGNMENTS: 'fth_delivery_assignments_db',
  DELIVERY_USER: 'fth_current_delivery_partner',
  DELIVERY_EARNINGS: 'fth_delivery_earnings_db',
  DELIVERY_NOTIFICATIONS: 'fth_delivery_notifications_db',
  DELIVERY_TICKETS: 'fth_delivery_tickets_db',
  ADMIN_USER: 'fth_current_admin',
  ADMIN_ACCOUNTS: 'fth_admin_accounts_db',
  CUSTOMERS: 'fth_customers_db',
  CATEGORIES: 'fth_categories_db',
  AUDIT_LOGS: 'fth_audit_logs_db',
  PLATFORM_SETTINGS: 'fth_platform_settings_db',
  ANNOUNCEMENTS: 'fth_announcements_db',
  ACTIVE_ROLE: 'fth_active_role'
};

export const INITIAL_FARMERS = [];
export const INITIAL_PRODUCTS = [];
export const INITIAL_REVIEWS = [];
export const INITIAL_ORDERS = [];
export const INITIAL_NOTIFICATIONS = [];
export const INITIAL_COMPLAINTS = [];
export const INITIAL_DELIVERY_PARTNERS = [];
export const INITIAL_DELIVERY_ASSIGNMENTS = [];
export const INITIAL_DELIVERY_NOTIFICATIONS = [];
export const INITIAL_DELIVERY_TICKETS = [];
export const INITIAL_ADMIN_ACCOUNTS = [];
export const INITIAL_CUSTOMERS = [];

export const INITIAL_CATEGORIES = [
  {
    id: 'cat-1',
    slug: 'vegetables',
    name: 'Fresh Vegetables',
    icon: 'Carrot',
    description: 'Harvested morning greens, heirloom roots & zero-chemical vegetables direct from local family farms.',
    productCount: 18,
    active: true,
    displayOrder: 1
  },
  {
    id: 'cat-2',
    slug: 'fruits',
    name: 'Orchard Fruits',
    icon: 'Apple',
    description: 'Tree-ripened native fruit varieties harvested in seasonal cycles with natural sweet flavor.',
    productCount: 12,
    active: true,
    displayOrder: 2
  },
  {
    id: 'cat-3',
    slug: 'dairy',
    name: 'Farm Fresh Dairy',
    icon: 'Milk',
    description: 'Fresh A2 desi cow milk, hand-churned traditional bilona ghee & raw cultured dairy.',
    productCount: 8,
    active: true,
    displayOrder: 3
  },
  {
    id: 'cat-4',
    slug: 'grains',
    name: 'Heritage Grains',
    icon: 'Wheat',
    description: 'Ancient climate-resilient unpolished millets, Khapli emmer wheat, and heirloom rice.',
    productCount: 14,
    active: true,
    displayOrder: 4
  },
  {
    id: 'cat-5',
    slug: 'honey',
    name: 'Raw Pure Honey',
    icon: 'Droplets',
    description: 'Unfiltered, raw apiary and wildflower forest honey harvested without heat treatment.',
    productCount: 6,
    active: true,
    displayOrder: 5
  },
  {
    id: 'cat-6',
    slug: 'spices',
    name: 'Stone-Ground Spices',
    icon: 'Sparkles',
    description: 'Pure cold-ground native turmeric, cumin, mustard seeds, and cold-pressed cooking oils.',
    productCount: 11,
    active: true,
    displayOrder: 6
  }
];

export const INITIAL_AUDIT_LOGS = [];

export const INITIAL_PLATFORM_SETTINGS = {
  platformFeeRate: 10,
  baseDeliveryFee: 40,
  ecoFleetBonus: 25,
  minOrderAmount: 150,
  freeDeliveryThreshold: 499,
  payoutSchedule: 'Every Tuesday & Friday at 6:00 PM IST',
  supportedZones: [
    { id: 'zone-1', name: 'Pune Central & Kothrud', active: true, hub: 'Paud Road Agro Cold Bay' },
    { id: 'zone-2', name: 'Baner / Wakad / PCMC', active: true, hub: 'Bavdhan Bypass Staging Hub' },
    { id: 'zone-3', name: 'Pune East & Hadapsar', active: true, hub: 'Magarpatta Distribution Yard' },
    { id: 'zone-4', name: 'Mumbai South Suburbs', active: true, hub: 'Vashi Staging Terminal' },
    { id: 'zone-5', name: 'Nashik Agro City', active: true, hub: 'Dindori Vineyard Cold Storage' }
  ],
  autoAssignCourier: true,
  maxDeliveryRadiusKm: 25,
  productModerationRequired: true
};

export const INITIAL_ANNOUNCEMENTS = [];


const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
const memoryStore = {};

const safeStorage = {
  getItem: (k) => (isBrowser ? localStorage.getItem(k) : (memoryStore[k] || null)),
  setItem: (k, v) => {
    if (isBrowser) localStorage.setItem(k, v);
    else memoryStore[k] = v;
  },
  removeItem: (k) => {
    if (isBrowser) localStorage.removeItem(k);
    else delete memoryStore[k];
  }
};

// Database / Local Storage Helper Class
class StorageService {
  constructor() {
    this.init();
  }

  init() {
    // Purge any legacy sample data from browser storage
    const sampleKeys = [
      STORAGE_KEYS.FARMERS,
      STORAGE_KEYS.PRODUCTS,
      STORAGE_KEYS.ORDERS,
      STORAGE_KEYS.CUSTOMERS,
      STORAGE_KEYS.DELIVERY_PARTNERS,
      STORAGE_KEYS.DELIVERY_ASSIGNMENTS,
      STORAGE_KEYS.REVIEWS,
      STORAGE_KEYS.NOTIFICATIONS,
      STORAGE_KEYS.COMPLAINTS,
      STORAGE_KEYS.CART,
      STORAGE_KEYS.WISHLIST
    ];
    for (const key of sampleKeys) {
      try {
        const val = safeStorage.getItem(key);
        if (val && (val.includes('prod-101') || val.includes('farmer-1') || val.includes('partner-1') || val.includes('ORD-8921') || val.includes('Priya Sharma') || val.includes('Ramesh Patel') || val.includes('Santosh Kumar') || val.includes('Santosh Gaikwad'))) {
          safeStorage.removeItem(key);
        }
      } catch {}
    }
  }

  // Generic getter and setter
  get(key) {
    try {
      const data = safeStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return null;
    }
  }

  set(key, val) {
    try {
      safeStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error(`Error writing ${key} to storage:`, e);
    }
  }

  remove(key) {
    try {
      safeStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing ${key} from storage:`, e);
    }
  }

  getActiveRole() {
    try {
      return safeStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) || null;
    } catch {
      return null;
    }
  }

  setActiveRole(role) {
    try {
      if (role) {
        safeStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
      } else {
        safeStorage.removeItem(STORAGE_KEYS.ACTIVE_ROLE);
      }
    } catch (e) {
      console.error('Error setting active role:', e);
    }
  }

  clearActiveRole() {
    try {
      safeStorage.removeItem(STORAGE_KEYS.ACTIVE_ROLE);
    } catch (e) {
      console.error('Error clearing active role:', e);
    }
  }

  // Farmers
  getFarmers() {
    return this.get(STORAGE_KEYS.FARMERS) || [];
  }

  getFarmerById(id) {
    return this.getFarmers().find((f) => f.id === id) || null;
  }

  // Products
  getProducts() {
    return this.get(STORAGE_KEYS.PRODUCTS) || [];
  }

  getProductById(id) {
    return this.getProducts().find((p) => p.id === id) || null;
  }

  updateProductStock(productId, decrementQty) {
    const products = this.getProducts();
    const updated = products.map((p) => {
      if (p.id === productId) {
        const newQty = Math.max(0, p.availableQuantity - decrementQty);
        return {
          ...p,
          availableQuantity: newQty,
          status: newQty === 0 ? 'out_of_stock' : 'active'
        };
      }
      return p;
    });
    this.set(STORAGE_KEYS.PRODUCTS, updated);
  }

  // Orders
  getOrders(customerId) {
    const all = this.get(STORAGE_KEYS.ORDERS) || [];
    if (!customerId) return all;
    return all.filter((o) => o.customerId === customerId);
  }

  getOrderById(id) {
    return (this.get(STORAGE_KEYS.ORDERS) || []).find((o) => o.id === id) || null;
  }

  createOrder(orderData) {
    const allOrders = this.get(STORAGE_KEYS.ORDERS) || [];
    const newOrder = {
      ...orderData,
      id: orderData.id || `FTH-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString()
    };
    allOrders.unshift(newOrder);
    this.set(STORAGE_KEYS.ORDERS, allOrders);

    // Decrement stock for purchased items
    if (Array.isArray(orderData.items)) {
      orderData.items.forEach((item) => {
        this.updateProductStock(item.productId, item.quantity);
      });
    }

    // Add confirmation notification
    this.addNotification({
      customerId: orderData.customerId,
      title: `Order Placed Successfully! (${newOrder.id})`,
      message: `Your harvest order of ₹${newOrder.totalAmount} has been received and routed to verified growers.`,
      type: 'order_confirmation',
      link: `/customer/orders/${newOrder.id}/track`
    });

    return newOrder;
  }

  cancelOrder(orderId, reason) {
    const allOrders = this.get(STORAGE_KEYS.ORDERS) || [];
    const updated = allOrders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          orderStatus: 'Cancelled',
          cancellationReason: reason || 'Cancelled by customer',
          cancelledAt: new Date().toISOString(),
          trackingTimeline: [
            ...o.trackingTimeline,
            {
              status: 'Cancelled',
              timestamp: new Date().toISOString(),
              note: `Order cancelled. Reason: ${reason || 'Customer request'}`
            }
          ]
        };
      }
      return o;
    });
    this.set(STORAGE_KEYS.ORDERS, updated);

    // Add notification
    const order = allOrders.find((o) => o.id === orderId);
    if (order) {
      this.addNotification({
        customerId: order.customerId,
        title: `Order #${orderId} Cancelled`,
        message: `Your order has been cancelled. Any online payment will be refunded to your source account within 2-3 business days.`,
        type: 'order_cancellation',
        link: `/customer/orders`
      });
    }
    return true;
  }

  // Reviews
  getReviews(productId) {
    const all = this.get(STORAGE_KEYS.REVIEWS) || [];
    if (!productId) return all;
    return all.filter((r) => r.productId === productId);
  }

  addReview(reviewData) {
    const all = this.get(STORAGE_KEYS.REVIEWS) || [];
    const newReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Today'
    };
    all.unshift(newReview);
    this.set(STORAGE_KEYS.REVIEWS, all);

    // Update product rating and reviewsCount in products
    const products = this.getProducts();
    const productReviews = all.filter((r) => r.productId === reviewData.productId);
    const avgRating = (productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length).toFixed(1);

    const updatedProducts = products.map((p) => {
      if (p.id === reviewData.productId) {
        return {
          ...p,
          rating: parseFloat(avgRating),
          reviewsCount: productReviews.length
        };
      }
      return p;
    });
    this.set(STORAGE_KEYS.PRODUCTS, updatedProducts);

    return newReview;
  }

  deleteReview(reviewId) {
    const all = this.get(STORAGE_KEYS.REVIEWS) || [];
    const updated = all.filter((r) => r.id !== reviewId);
    this.set(STORAGE_KEYS.REVIEWS, updated);
    return true;
  }

  // Notifications
  getNotifications(customerId) {
    const all = this.get(STORAGE_KEYS.NOTIFICATIONS) || [];
    if (!customerId) return all;
    return all.filter((n) => n.customerId === customerId);
  }

  markNotificationAsRead(id) {
    const all = this.get(STORAGE_KEYS.NOTIFICATIONS) || [];
    const updated = all.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    this.set(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  markAllNotificationsAsRead(customerId) {
    const all = this.get(STORAGE_KEYS.NOTIFICATIONS) || [];
    const updated = all.map((n) => (n.customerId === customerId ? { ...n, isRead: true } : n));
    this.set(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  addNotification(notif) {
    const all = this.get(STORAGE_KEYS.NOTIFICATIONS) || [];
    const newNotif = {
      ...notif,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    all.unshift(newNotif);
    this.set(STORAGE_KEYS.NOTIFICATIONS, all);
    return newNotif;
  }

  // Complaints / Support
  getComplaints(customerId) {
    const all = this.get(STORAGE_KEYS.COMPLAINTS) || [];
    if (!customerId) return all;
    return all.filter((c) => c.customerId === customerId);
  }

  addComplaint(data) {
    const all = this.get(STORAGE_KEYS.COMPLAINTS) || [];
    const newComplaint = {
      ...data,
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Submitted',
      createdAt: new Date().toISOString()
    };
    all.unshift(newComplaint);
    this.set(STORAGE_KEYS.COMPLAINTS, all);

    this.addNotification({
      customerId: data.customerId,
      title: `Support Ticket Created (#${newComplaint.id})`,
      message: `Your complaint regarding "${data.subject}" has been received. Our resolution desk will reply within 4 hours.`,
      type: 'support_ticket',
      link: '/customer/support'
    });

    return newComplaint;
  }

  getFarmerTickets(farmerId) {
    const all = this.get(STORAGE_KEYS.COMPLAINTS) || INITIAL_COMPLAINTS;
    if (!farmerId) return all.filter((c) => c.role === 'farmer');
    return all.filter((c) => c.farmerId === farmerId || c.complainantId === farmerId || (c.role === 'farmer' && (!c.farmerId || c.farmerId === farmerId)));
  }

  createFarmerTicket(data) {
    const all = this.get(STORAGE_KEYS.COMPLAINTS) || INITIAL_COMPLAINTS;
    const newTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerId: data.farmerId,
      complainantId: data.farmerId,
      complainantName: data.farmerName || 'Farmer Partner',
      role: 'farmer',
      userRole: 'farmer',
      issueType: data.category || 'Agronomy & Logistics',
      category: data.category || 'Agronomy & Logistics',
      subject: data.subject,
      description: data.message,
      status: 'Open',
      priority: data.priority || 'Normal',
      createdAt: new Date().toISOString(),
      resolutionNote: null,
      assignedTo: 'Regional Field Agronomist'
    };
    all.unshift(newTicket);
    this.set(STORAGE_KEYS.COMPLAINTS, all);

    this.addNotification({
      farmerId: data.farmerId,
      title: `Support Inquiry Registered (#${newTicket.id})`,
      message: `Your inquiry "${data.subject}" has been received. Our regional field team will follow up shortly.`,
      type: 'support_ticket',
      link: '/farmer/support'
    });

    return newTicket;
  }

  // --- FARMER MODULE METHODS ---
  saveFarmer(farmerData) {
    const newFarmer = {
      id: `farmer-${Date.now()}`,
      name: farmerData.fullName || farmerData.name,
      fullName: farmerData.fullName || farmerData.name,
      farmName: farmerData.farmName,
      location: `${farmerData.district || ''}, ${farmerData.state || ''}`.replace(/^, |, $/g, ''),
      state: farmerData.state || '',
      district: farmerData.district || '',
      village: farmerData.village || '',
      pincode: farmerData.pincode || '',
      farmAddress: farmerData.farmAddress || '',
      phone: farmerData.mobile || farmerData.phone || '',
      email: farmerData.email || '',
      farmType: farmerData.farmType || 'Natural Farm',
      productsGrown: farmerData.productsGrown || [],
      experienceYears: farmerData.experienceYears || 5,
      acreage: farmerData.acreage || '5 Acres',
      farmingPractices: farmerData.farmingPractices || 'Organic cultivation',
      bio: farmerData.bio || farmerData.farmDescription || 'Registered family agricultural producer on Farm to Home.',
      avatar: farmerData.avatar || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      farmPhotographs: farmerData.farmPhotographs || [],
      documents: farmerData.documents || [
        { name: 'Government_Photo_ID.pdf', type: 'ID Proof', status: 'Under Review' },
        { name: 'Farm_Ownership_Record.pdf', type: 'Land Ownership', status: 'Under Review' }
      ],
      isVerified: false,
      verificationStatus: 'Pending',
      verificationBadge: 'Verification Under Review',
      adminFeedback: 'Application under verification. Field manager assigned for compliance review within 24 hours.',
      rating: 0,
      totalReviews: 0,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    const farmers = this.getFarmers();
    farmers.unshift(newFarmer);
    this.set(STORAGE_KEYS.FARMERS, farmers);
    this.set(STORAGE_KEYS.FARMER_USER, newFarmer);

    this.addNotification({
      farmerId: newFarmer.id,
      title: 'Farmer Registration Received',
      message: 'Welcome to Farm to Home. Your farm documents are being reviewed by the agronomy compliance board.',
      type: 'verification'
    });

    return newFarmer;
  }

  updateFarmerProfile(farmerId, updates) {
    const allFarmers = this.getFarmers();
    let updatedFarmer = null;
    const updatedAll = allFarmers.map((f) => {
      if (f.id === farmerId) {
        updatedFarmer = { ...f, ...updates };
        return updatedFarmer;
      }
      return f;
    });
    this.set(STORAGE_KEYS.FARMERS, updatedAll);

    const currentUser = this.get(STORAGE_KEYS.FARMER_USER);
    if (currentUser && currentUser.id === farmerId) {
      this.set(STORAGE_KEYS.FARMER_USER, updatedFarmer);
    }
    return updatedFarmer;
  }

  getFarmerProducts(farmerId) {
    const prods = this.getProducts();
    if (!farmerId) return prods;
    return prods.filter((p) => p.farmerId === farmerId);
  }

  createFarmerProduct(productData) {
    const prods = this.getProducts();
    const newProd = {
      ...productData,
      id: productData.id || `prod-${Date.now()}`,
      status: productData.status || 'active',
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString()
    };
    prods.unshift(newProd);
    this.set(STORAGE_KEYS.PRODUCTS, prods);

    // Record initial stock entry
    this.logStockHistory({
      farmerId: productData.farmerId,
      productId: newProd.id,
      productName: newProd.name,
      changeType: 'Initial Harvest Listing',
      quantityChange: newProd.availableQuantity,
      resultingQuantity: newProd.availableQuantity,
      note: 'Initial listing published by farmer'
    });

    return newProd;
  }

  updateFarmerProduct(productId, updates) {
    const prods = this.getProducts();
    let updatedItem = null;
    const updated = prods.map((p) => {
      if (p.id === productId) {
        updatedItem = { ...p, ...updates };
        return updatedItem;
      }
      return p;
    });
    this.set(STORAGE_KEYS.PRODUCTS, updated);
    return updatedItem;
  }

  deleteFarmerProduct(productId) {
    const prods = this.getProducts();
    const filtered = prods.filter((p) => p.id !== productId);
    this.set(STORAGE_KEYS.PRODUCTS, filtered);
    return true;
  }

  logStockHistory(entry) {
    const history = this.get(STORAGE_KEYS.STOCK_HISTORY) || [];
    const newEntry = {
      ...entry,
      id: `stk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    history.unshift(newEntry);
    this.set(STORAGE_KEYS.STOCK_HISTORY, history);
    return newEntry;
  }

  getStockHistory(farmerId) {
    const history = this.get(STORAGE_KEYS.STOCK_HISTORY) || [];
    if (!farmerId) return history;
    return history.filter((h) => h.farmerId === farmerId);
  }

  updateStockWithHistory(productId, newQty, reason, farmerId) {
    const prods = this.getProducts();
    const prod = prods.find((p) => p.id === productId);
    if (!prod) return null;
    const oldQty = prod.availableQuantity;
    const diff = newQty - oldQty;

    this.updateProductStock(productId, -diff); // updates stock

    this.logStockHistory({
      farmerId: farmerId || prod.farmerId,
      productId: prod.id,
      productName: prod.name,
      changeType: diff >= 0 ? 'Restock / Dawn Harvest' : 'Manual Adjustment / Spoilage',
      quantityChange: diff,
      resultingQuantity: newQty,
      note: reason || 'Manual inventory update by grower'
    });

    return this.getProductById(productId);
  }

  getFarmerOrders(farmerId) {
    const allOrders = this.get(STORAGE_KEYS.ORDERS) || [];
    if (!farmerId) return allOrders;
    return allOrders.filter((o) =>
      o.items?.some((i) => i.farmerId === farmerId)
    );
  }

  updateOrderStatusByFarmer(orderId, newStatus, note, deliveryData = {}) {
    const allOrders = this.get(STORAGE_KEYS.ORDERS) || [];
    const updated = allOrders.map((o) => {
      if (o.id === orderId) {
        const timeline = o.trackingTimeline || [];
        timeline.push({
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: note || `Order updated to ${newStatus} by farmer.`
        });

        const updatedOrder = {
          ...o,
          orderStatus: newStatus,
          trackingTimeline: timeline
        };

        if (deliveryData.partnerName) {
          updatedOrder.deliveryPartner = {
            assigned: true,
            name: deliveryData.partnerName,
            phone: deliveryData.partnerPhone || '+91 98112 00412',
            vehicleType: deliveryData.vehicleType || 'Eco Electric Carrier'
          };
        }

        if (newStatus === 'Delivered') {
          updatedOrder.deliveredAt = new Date().toISOString();
          updatedOrder.paymentStatus = 'Paid';
        }

        return updatedOrder;
      }
      return o;
    });

    this.set(STORAGE_KEYS.ORDERS, updated);

    // Notify customer
    const order = allOrders.find((o) => o.id === orderId);
    if (order) {
      this.addNotification({
        customerId: order.customerId,
        title: `Order #${orderId} Updated: ${newStatus}`,
        message: note || `Your order status has progressed to ${newStatus}.`,
        type: 'order_update',
        link: `/customer/orders/${orderId}/track`
      });
    }

    return true;
  }

  getFarmerReviews(farmerId) {
    const allReviews = this.get(STORAGE_KEYS.REVIEWS) || INITIAL_REVIEWS;
    const products = this.getFarmerProducts(farmerId);
    const productIds = new Set(products.map((p) => p.id));
    return allReviews.filter((r) => productIds.has(r.productId) || r.farmerId === farmerId);
  }

  addFarmerReplyToReview(reviewId, replyText) {
    const all = this.get(STORAGE_KEYS.REVIEWS) || INITIAL_REVIEWS;
    let updatedReply = null;
    const updated = all.map((r) => {
      if (r.id === reviewId) {
        updatedReply = {
          text: replyText,
          replyText: replyText,
          timestamp: new Date().toISOString()
        };
        return {
          ...r,
          farmerReply: updatedReply
        };
      }
      return r;
    });
    this.set(STORAGE_KEYS.REVIEWS, updated);
    return updatedReply || { text: replyText, replyText };
  }

  getFarmerEarnings(farmerId) {
    const orders = this.getFarmerOrders(farmerId);
    let totalGrossSales = 0;
    let completedEarnings = 0;
    let pendingSettlements = 0;
    const transactions = [];

    orders.forEach((o) => {
      // Calculate farmer's items total in this order
      const farmerItems = (o.items || []).filter((i) => i.farmerId === farmerId);
      const orderFarmerTotal = farmerItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

      if (orderFarmerTotal > 0 && o.orderStatus !== 'Cancelled') {
        const platformFee = Math.round(orderFarmerTotal * 0.10); // 10% platform fee, 90% to farmer
        const netFarmerEarnings = orderFarmerTotal - platformFee;

        totalGrossSales += orderFarmerTotal;

        if (o.orderStatus === 'Delivered') {
          completedEarnings += netFarmerEarnings;
        } else {
          pendingSettlements += netFarmerEarnings;
        }

        transactions.push({
          orderId: o.id,
          date: o.createdAt,
          itemsCount: farmerItems.length,
          status: o.orderStatus,
          grossAmount: orderFarmerTotal,
          platformFee: platformFee,
          netAmount: netFarmerEarnings,
          payoutStatus: o.orderStatus === 'Delivered' ? 'Settled to Bank' : 'Escrow Pending Delivery'
        });
      }
    });

    return {
      totalGrossSales,
      completedEarnings,
      pendingSettlements,
      platformFeeRate: '10%',
      transactions
    };
  }

  setFarmerVerificationStatus(farmerId, status, feedback) {
    const farmers = this.getFarmers();
    const updated = farmers.map((f) => {
      if (f.id === farmerId) {
        return {
          ...f,
          verificationStatus: status,
          isVerified: status === 'Approved',
          adminFeedback: feedback || f.adminFeedback
        };
      }
      return f;
    });
    this.set(STORAGE_KEYS.FARMERS, updated);

    // Update in current farmer if logged in
    const current = this.get(STORAGE_KEYS.FARMER_USER);
    if (current && current.id === farmerId) {
      this.set(STORAGE_KEYS.FARMER_USER, {
        ...current,
        verificationStatus: status,
        isVerified: status === 'Approved',
        adminFeedback: feedback || current.adminFeedback
      });
    }
  }

  resubmitFarmerVerification(farmerId, updatedData) {
    const farmers = this.getFarmers();
    const updated = farmers.map((f) => {
      if (f.id === farmerId) {
        return {
          ...f,
          ...updatedData,
          verificationStatus: 'Pending',
          isVerified: false,
          adminFeedback: 'Resubmitted on ' + new Date().toLocaleDateString() + '. Pending admin compliance inspection.'
        };
      }
      return f;
    });
    this.set(STORAGE_KEYS.FARMERS, updated);

    const current = this.get(STORAGE_KEYS.FARMER_USER);
    if (current && current.id === farmerId) {
      this.set(STORAGE_KEYS.FARMER_USER, {
        ...current,
        ...updatedData,
        verificationStatus: 'Pending',
        isVerified: false
      });
    }
    return true;
  }

  // ==========================================
  // DELIVERY PARTNER MODULE METHODS
  // ==========================================

  getDeliveryPartners() {
    return this.get(STORAGE_KEYS.DELIVERY_PARTNERS) || INITIAL_DELIVERY_PARTNERS;
  }

  getDeliveryPartnerById(id) {
    const partners = this.getDeliveryPartners();
    return partners.find((p) => p.id === id) || null;
  }

  getCurrentDeliveryPartner() {
    return this.get(STORAGE_KEYS.DELIVERY_USER);
  }

  setCurrentDeliveryPartner(partner) {
    this.set(STORAGE_KEYS.DELIVERY_USER, partner);
  }

  saveDeliveryPartner(partnerData) {
    const partners = this.getDeliveryPartners();
    const newPartner = {
      id: `partner-${Date.now()}`,
      rating: 5.0,
      totalDeliveries: 0,
      onTimeRate: '100%',
      isOnline: false,
      isAvailable: false,
      isVerified: false,
      verificationStatus: 'Pending',
      verificationBadge: 'Verification Under Review',
      joinedDate: 'November 2026',
      adminFeedback: 'Application received. Document verification in progress by transport compliance team.',
      documents: partnerData.documents || [
        { name: 'Driving_License.pdf', type: 'Driving License', status: 'Under Review', date: new Date().toLocaleDateString() },
        { name: 'Aadhaar_Card.pdf', type: 'Government ID', status: 'Under Review', date: new Date().toLocaleDateString() },
        { name: 'Vehicle_RC.pdf', type: 'Vehicle RC', status: 'Under Review', date: new Date().toLocaleDateString() }
      ],
      bankDetails: {
        accountHolder: partnerData.name,
        accountNumber: '•••• •••• ' + (partnerData.accountNumber ? partnerData.accountNumber.slice(-4) : '0000'),
        ifsc: partnerData.ifsc || 'HDFC0001824',
        bankName: partnerData.bankName || 'HDFC Bank',
        upiId: partnerData.upiId || `${partnerData.mobile}@upi`
      },
      ...partnerData
    };
    partners.push(newPartner);
    this.set(STORAGE_KEYS.DELIVERY_PARTNERS, partners);
    this.setCurrentDeliveryPartner(newPartner);
    return newPartner;
  }

  updateDeliveryPartnerProfile(id, updates) {
    const partners = this.getDeliveryPartners();
    const updated = partners.map((p) => (p.id === id ? { ...p, ...updates } : p));
    this.set(STORAGE_KEYS.DELIVERY_PARTNERS, updated);

    const current = this.getCurrentDeliveryPartner();
    if (current && current.id === id) {
      const updatedCurrent = { ...current, ...updates };
      this.setCurrentDeliveryPartner(updatedCurrent);
    }
    return true;
  }

  setDeliveryPartnerVerification(id, status, feedback) {
    const partners = this.getDeliveryPartners();
    const badgeMap = {
      Approved: 'Certified Eco-Fleet Courier',
      Pending: 'Verification Under Review',
      Rejected: 'Action Required: Fix Documents'
    };
    const updated = partners.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          verificationStatus: status,
          isVerified: status === 'Approved',
          verificationBadge: badgeMap[status] || 'Verification Status Updated',
          adminFeedback: feedback || p.adminFeedback
        };
      }
      return p;
    });
    this.set(STORAGE_KEYS.DELIVERY_PARTNERS, updated);

    const current = this.getCurrentDeliveryPartner();
    if (current && current.id === id) {
      this.setCurrentDeliveryPartner({
        ...current,
        verificationStatus: status,
        isVerified: status === 'Approved',
        verificationBadge: badgeMap[status] || 'Verification Status Updated',
        adminFeedback: feedback || current.adminFeedback
      });
    }
  }

  resubmitDeliveryVerification(id, updatedDocs) {
    const partners = this.getDeliveryPartners();
    const updated = partners.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          documents: updatedDocs || p.documents,
          verificationStatus: 'Pending',
          isVerified: false,
          verificationBadge: 'Verification Under Review',
          adminFeedback: 'Resubmitted on ' + new Date().toLocaleDateString() + '. Transport verification team reviewing revised documents.'
        };
      }
      return p;
    });
    this.set(STORAGE_KEYS.DELIVERY_PARTNERS, updated);

    const current = this.getCurrentDeliveryPartner();
    if (current && current.id === id) {
      this.setCurrentDeliveryPartner({
        ...current,
        documents: updatedDocs || current.documents,
        verificationStatus: 'Pending',
        isVerified: false,
        verificationBadge: 'Verification Under Review',
        adminFeedback: 'Resubmitted on ' + new Date().toLocaleDateString() + '. Transport verification team reviewing revised documents.'
      });
    }
    return true;
  }

  getDeliveryAssignments() {
    return this.get(STORAGE_KEYS.DELIVERY_ASSIGNMENTS) || INITIAL_DELIVERY_ASSIGNMENTS;
  }

  getAvailableDeliveryJobs(partnerId, serviceArea) {
    const assignments = this.getDeliveryAssignments();
    // Strict integration rule 1: ONLY platform deliveries appear here
    return assignments.filter((job) => {
      const isPlatform = job.deliveryMethod === 'platform';
      const isAssignedStatus = job.status === 'Assigned' && !job.partnerId;
      const notRejectedByMe = !job.rejectedBy || !job.rejectedBy.some((r) => r.partnerId === partnerId);
      
      // Match service area if specified and not 'All Zones'
      let matchesArea = true;
      if (serviceArea && serviceArea !== 'All Zones' && serviceArea !== 'All Service Areas') {
        const areaLower = serviceArea.toLowerCase();
        matchesArea =
          (job.drop?.city && areaLower.includes(job.drop.city.toLowerCase())) ||
          (job.drop?.address && areaLower.includes(job.drop.address.toLowerCase())) ||
          (job.pickup?.address && areaLower.includes(job.pickup.address.toLowerCase())) ||
          areaLower.includes('pune');
      }

      return isPlatform && isAssignedStatus && notRejectedByMe && matchesArea;
    });
  }

  getPartnerActiveDeliveries(partnerId) {
    const assignments = this.getDeliveryAssignments();
    return assignments.filter(
      (job) => job.partnerId === partnerId && job.status !== 'Delivered' && job.status !== 'Failed delivery'
    );
  }

  getPartnerDeliveryHistory(partnerId) {
    const assignments = this.getDeliveryAssignments();
    return assignments.filter(
      (job) => job.partnerId === partnerId && (job.status === 'Delivered' || job.status === 'Failed delivery')
    );
  }

  acceptDeliveryJob(jobId, partnerId, partnerName) {
    const assignments = this.getDeliveryAssignments();
    const jobIndex = assignments.findIndex((j) => j.id === jobId);

    if (jobIndex === -1) {
      return { success: false, reason: 'JOB_NOT_FOUND', message: 'Delivery request not found.' };
    }

    const job = assignments[jobIndex];

    // Race condition check: If another partner already claimed this job
    if (job.partnerId && job.partnerId !== partnerId) {
      return {
        success: false,
        reason: 'CLAIMED',
        message: 'This delivery job was just accepted by another eco-courier.'
      };
    }

    const nowIso = new Date().toISOString();
    job.partnerId = partnerId;
    job.partnerName = partnerName || 'Eco Fleet Partner';
    job.status = 'Accepted';
    job.acceptedAt = nowIso;
    job.timeline = job.timeline || [];
    job.timeline.push({
      status: 'Accepted',
      timestamp: nowIso,
      note: `Accepted by courier ${partnerName || 'Partner'}. En route to pickup hub.`
    });

    assignments[jobIndex] = job;
    this.set(STORAGE_KEYS.DELIVERY_ASSIGNMENTS, assignments);

    // Synchronize corresponding order in customer/farmer order database
    if (job.orderId) {
      const orders = this.getOrders();
      const updatedOrders = orders.map((o) => {
        if (o.id === job.orderId) {
          return {
            ...o,
            deliveryPartner: {
              assigned: true,
              name: partnerName || 'Eco Fleet Partner',
              phone: '+91 98220 33411',
              vehicleType: 'Eco Electric Carrier'
            },
            trackingTimeline: [
              ...(o.trackingTimeline || []),
              {
                status: 'Confirmed',
                timestamp: nowIso,
                note: `Delivery assigned to partner ${partnerName || 'Courier'}. Pickup scheduled.`
              }
            ]
          };
        }
        return o;
      });
      this.set(STORAGE_KEYS.ORDERS, updatedOrders);
    }

    return { success: true, job };
  }

  rejectDeliveryJob(jobId, partnerId, reason) {
    const assignments = this.getDeliveryAssignments();
    const updated = assignments.map((j) => {
      if (j.id === jobId) {
        const rejectedBy = j.rejectedBy || [];
        rejectedBy.push({
          partnerId,
          reason: reason || 'Declined by courier',
          timestamp: new Date().toISOString()
        });
        return { ...j, rejectedBy };
      }
      return j;
    });
    this.set(STORAGE_KEYS.DELIVERY_ASSIGNMENTS, updated);
    return { success: true };
  }

  updateDeliveryWorkflow(jobId, newStatus, note) {
    const assignments = this.getDeliveryAssignments();
    const jobIndex = assignments.findIndex((j) => j.id === jobId);
    if (jobIndex === -1) return null;

    const job = assignments[jobIndex];
    const nowIso = new Date().toISOString();
    job.status = newStatus;

    if (newStatus === 'Reached pickup location') job.reachedPickupAt = nowIso;
    if (newStatus === 'Picked up') job.pickedUpAt = nowIso;
    if (newStatus === 'Delivered') job.deliveredAt = nowIso;

    job.timeline = job.timeline || [];
    job.timeline.push({
      status: newStatus,
      timestamp: nowIso,
      note: note || `Status progressed to ${newStatus}`
    });

    assignments[jobIndex] = job;
    this.set(STORAGE_KEYS.DELIVERY_ASSIGNMENTS, assignments);

    // Also update order in customer orders collection
    if (job.orderId) {
      const orders = this.getOrders();
      const updatedOrders = orders.map((o) => {
        if (o.id === job.orderId) {
          return {
            ...o,
            orderStatus: newStatus === 'Reached pickup location' ? 'Ready for pickup' : newStatus,
            deliveredAt: newStatus === 'Delivered' ? nowIso : o.deliveredAt,
            trackingTimeline: [
              ...(o.trackingTimeline || []),
              {
                status: newStatus === 'Reached pickup location' ? 'Ready for pickup' : newStatus,
                timestamp: nowIso,
                note: note || `Courier updated milestone: ${newStatus}`
              }
            ]
          };
        }
        return o;
      });
      this.set(STORAGE_KEYS.ORDERS, updatedOrders);
    }

    return job;
  }

  confirmPickup(jobId, checklist, damagedReport) {
    const assignments = this.getDeliveryAssignments();
    const jobIndex = assignments.findIndex((j) => j.id === jobId);
    if (jobIndex === -1) return { success: false, message: 'Job not found' };

    const job = assignments[jobIndex];
    const nowIso = new Date().toISOString();

    job.itemsChecklistVerified = true;
    job.damageReport = damagedReport || null;
    if (checklist && Array.isArray(checklist)) {
      job.items = job.items.map((item, idx) => ({
        ...item,
        checked: checklist[idx] !== undefined ? checklist[idx] : true
      }));
    }

    job.status = 'Picked up';
    job.pickedUpAt = nowIso;
    job.timeline = job.timeline || [];
    job.timeline.push({
      status: 'Picked up',
      timestamp: nowIso,
      note: damagedReport
        ? `Picked up with condition note: ${damagedReport}`
        : 'All items verified against manifest. Farm crates securely loaded.'
    });

    assignments[jobIndex] = job;
    this.set(STORAGE_KEYS.DELIVERY_ASSIGNMENTS, assignments);

    // Sync to Orders collection
    if (job.orderId) {
      const orders = this.getOrders();
      const updatedOrders = orders.map((o) => {
        if (o.id === job.orderId) {
          return {
            ...o,
            orderStatus: 'Picked up',
            trackingTimeline: [
              ...(o.trackingTimeline || []),
              {
                status: 'Picked up',
                timestamp: nowIso,
                note: 'Courier completed crate inspection & departed from farm hub.'
              }
            ]
          };
        }
        return o;
      });
      this.set(STORAGE_KEYS.ORDERS, updatedOrders);
    }

    return { success: true, job };
  }

  confirmDelivery(jobId, { otpInput, cashCollected, photoProof, signature, notes }) {
    const assignments = this.getDeliveryAssignments();
    const jobIndex = assignments.findIndex((j) => j.id === jobId);
    if (jobIndex === -1) return { success: false, reason: 'NOT_FOUND', message: 'Delivery not found' };

    const job = assignments[jobIndex];

    // OTP Verification Check
    const expectedOtp = job.customerOtp || '1234';
    if (otpInput && otpInput.trim() !== expectedOtp.trim()) {
      return {
        success: false,
        reason: 'INVALID_OTP',
        message: `Incorrect OTP (${otpInput}). Please ask the customer for the 4-digit code shown in their Farm to Home app.`
      };
    }

    const nowIso = new Date().toISOString();
    job.status = 'Delivered';
    job.deliveredAt = nowIso;
    job.deliveryProof = {
      otpVerified: true,
      cashCollected: !!cashCollected,
      photoProof: photoProof || null,
      signature: signature || null,
      notes: notes || 'Delivered directly to customer door.'
    };
    if (job.paymentMethod === 'cod') {
      job.paymentStatus = 'Paid';
    }

    job.timeline = job.timeline || [];
    job.timeline.push({
      status: 'Delivered',
      timestamp: nowIso,
      note: `Delivery completed successfully. Verified via customer OTP ${expectedOtp}.`
    });

    assignments[jobIndex] = job;
    this.set(STORAGE_KEYS.DELIVERY_ASSIGNMENTS, assignments);

    // Synchronize Orders collection to Delivered
    if (job.orderId) {
      const orders = this.getOrders();
      const updatedOrders = orders.map((o) => {
        if (o.id === job.orderId) {
          return {
            ...o,
            orderStatus: 'Delivered',
            paymentStatus: 'Paid',
            deliveredAt: nowIso,
            trackingTimeline: [
              ...(o.trackingTimeline || []),
              {
                status: 'Delivered',
                timestamp: nowIso,
                note: 'Package handed over to customer. OTP confirmed.'
              }
            ]
          };
        }
        return o;
      });
      this.set(STORAGE_KEYS.ORDERS, updatedOrders);
    }

    // Add notification to partner
    this.addDeliveryNotification(job.partnerId, {
      type: 'payout',
      title: `Trip Completed: ₹${job.payout?.total || 165} Earned! 🎉`,
      message: `Delivery for Order #${job.orderId} verified. Earnings credited to your pending payout balance.`,
      link: '/delivery/earnings'
    });

    return { success: true, job };
  }

  reportDeliveryFailure(jobId, { reason, notes, returnAction }) {
    const assignments = this.getDeliveryAssignments();
    const jobIndex = assignments.findIndex((j) => j.id === jobId);
    if (jobIndex === -1) return { success: false, message: 'Delivery not found' };

    const job = assignments[jobIndex];
    const nowIso = new Date().toISOString();

    job.status = 'Failed delivery';
    job.failureReason = `${reason}${notes ? ': ' + notes : ''}`;
    job.returnAction = returnAction || 'Return goods to Cold Staging Hub';
    job.timeline = job.timeline || [];
    job.timeline.push({
      status: 'Failed delivery',
      timestamp: nowIso,
      note: `Delivery attempt failed: ${reason}. Action: ${job.returnAction}`
    });

    assignments[jobIndex] = job;
    this.set(STORAGE_KEYS.DELIVERY_ASSIGNMENTS, assignments);

    // Sync to Orders collection
    if (job.orderId) {
      const orders = this.getOrders();
      const updatedOrders = orders.map((o) => {
        if (o.id === job.orderId) {
          return {
            ...o,
            orderStatus: 'Cancelled',
            trackingTimeline: [
              ...(o.trackingTimeline || []),
              {
                status: 'Failed delivery',
                timestamp: nowIso,
                note: `Delivery unsuccessful: ${reason}. Support team will contact you to reschedule.`
              }
            ]
          };
        }
        return o;
      });
      this.set(STORAGE_KEYS.ORDERS, updatedOrders);
    }

    // Automatically file a support ticket for records
    this.submitDeliveryTicket({
      partnerId: job.partnerId,
      orderId: job.orderId,
      category: reason,
      subject: `Failed Delivery for #${job.orderId}: ${reason}`,
      description: notes || 'Delivery could not be completed at customer premises.'
    });

    return { success: true, job };
  }

  getDeliveryPartnerEarnings(partnerId) {
    const assignments = this.getDeliveryAssignments();
    const partnerJobs = assignments.filter((j) => j.partnerId === partnerId);
    const deliveredJobs = partnerJobs.filter((j) => j.status === 'Delivered');

    const todayDateStr = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    let todayEarnings = 0;
    let weeklyEarnings = 0;
    let totalGrossEarnings = 0;
    let basePayTotal = 0;
    let distancePayTotal = 0;
    let ecoIncentivesTotal = 0;
    let tipsTotal = 0;

    deliveredJobs.forEach((job) => {
      const payout = job.payout || { total: 150, base: 60, distancePay: 60, ecoIncentive: 25, tip: 5 };
      totalGrossEarnings += payout.total || 0;
      basePayTotal += payout.base || 60;
      distancePayTotal += payout.distancePay || 0;
      ecoIncentivesTotal += payout.ecoIncentive || 0;
      tipsTotal += payout.tip || 0;

      const jobTime = job.deliveredAt || job.createdAt;
      if (jobTime && jobTime.startsWith(todayDateStr)) {
        todayEarnings += payout.total || 0;
      }
      if (jobTime && jobTime >= sevenDaysAgo) {
        weeklyEarnings += payout.total || 0;
      }
    });

    // Recent settlements history
    const payoutHistory = [
      {
        id: 'PAY-FTH-4491',
        date: '2026-10-31',
        amount: 2480,
        tripsCount: 16,
        status: 'Settled to Bank',
        bankAccount: 'HDFC Bank ending 4412',
        refNumber: 'IMPS-984120914'
      },
      {
        id: 'PAY-FTH-4410',
        date: '2026-10-24',
        amount: 2850,
        tripsCount: 19,
        status: 'Settled to Bank',
        bankAccount: 'HDFC Bank ending 4412',
        refNumber: 'IMPS-983110298'
      },
      {
        id: 'PAY-FTH-4389',
        date: '2026-10-17',
        amount: 3120,
        tripsCount: 21,
        status: 'Settled to Bank',
        bankAccount: 'HDFC Bank ending 4412',
        refNumber: 'IMPS-982001928'
      }
    ];

    return {
      todayEarnings,
      weeklyEarnings,
      monthlyEarnings: totalGrossEarnings + 5400,
      totalGrossEarnings,
      completedTripsCount: deliveredJobs.length,
      pendingPayoutBalance: todayEarnings + 320,
      breakdown: {
        basePay: basePayTotal,
        distancePay: distancePayTotal,
        ecoIncentives: ecoIncentivesTotal,
        tips: tipsTotal
      },
      payoutSchedule: 'Every Tuesday & Friday at 6:00 PM IST',
      payoutHistory,
      deliveredJobs
    };
  }

  getDeliveryNotifications(partnerId) {
    const notifs = this.get(STORAGE_KEYS.DELIVERY_NOTIFICATIONS) || INITIAL_DELIVERY_NOTIFICATIONS;
    return notifs.filter((n) => !partnerId || n.partnerId === partnerId || n.partnerId === 'all');
  }

  addDeliveryNotification(partnerId, notifData) {
    const notifs = this.get(STORAGE_KEYS.DELIVERY_NOTIFICATIONS) || INITIAL_DELIVERY_NOTIFICATIONS;
    const newNotif = {
      id: `del-notif-${Date.now()}`,
      partnerId,
      read: false,
      createdAt: new Date().toISOString(),
      ...notifData
    };
    notifs.unshift(newNotif);
    this.set(STORAGE_KEYS.DELIVERY_NOTIFICATIONS, notifs);
    return newNotif;
  }

  markDeliveryNotificationRead(id) {
    const notifs = this.get(STORAGE_KEYS.DELIVERY_NOTIFICATIONS) || INITIAL_DELIVERY_NOTIFICATIONS;
    const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.set(STORAGE_KEYS.DELIVERY_NOTIFICATIONS, updated);
  }

  clearDeliveryNotifications(partnerId) {
    const notifs = this.get(STORAGE_KEYS.DELIVERY_NOTIFICATIONS) || INITIAL_DELIVERY_NOTIFICATIONS;
    const filtered = notifs.filter((n) => n.partnerId !== partnerId);
    this.set(STORAGE_KEYS.DELIVERY_NOTIFICATIONS, filtered);
  }

  submitDeliveryTicket(ticketData) {
    const tickets = this.get(STORAGE_KEYS.DELIVERY_TICKETS) || INITIAL_DELIVERY_TICKETS;
    const newTicket = {
      id: `TKT-DEL-${Date.now().toString().slice(-4)}`,
      status: 'Open',
      createdAt: new Date().toISOString(),
      ...ticketData
    };
    tickets.unshift(newTicket);
    this.set(STORAGE_KEYS.DELIVERY_TICKETS, tickets);
    return newTicket;
  }

  getDeliveryTickets(partnerId) {
    const tickets = this.get(STORAGE_KEYS.DELIVERY_TICKETS) || INITIAL_DELIVERY_TICKETS;
    return tickets.filter((t) => !partnerId || t.partnerId === partnerId);
  }

  // ================= ADMIN CONSOLE METHODS ================= //

  getAdminAccounts() {
    return this.get(STORAGE_KEYS.ADMIN_ACCOUNTS) || INITIAL_ADMIN_ACCOUNTS;
  }

  getCurrentAdmin() {
    const raw = safeStorage.getItem(STORAGE_KEYS.ADMIN_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  setCurrentAdmin(admin) {
    if (admin) {
      safeStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(admin));
    } else {
      safeStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
    }
  }

  adminLogin(identifier, password) {
    const admins = this.getAdminAccounts();
    const cleanId = (identifier || '').trim().toLowerCase();
    const admin = admins.find(
      (a) => a.email.toLowerCase() === cleanId || a.username.toLowerCase() === cleanId
    );

    if (!admin) {
      return { success: false, message: 'Invalid admin credentials or account not found.' };
    }

    if (admin.status === 'Suspended') {
      return { success: false, message: 'This admin account is suspended. Contact super administrator.' };
    }

    if (password && password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    const updatedAdmin = {
      ...admin,
      lastLogin: new Date().toISOString()
    };

    const updatedList = admins.map((a) => (a.id === admin.id ? updatedAdmin : a));
    this.set(STORAGE_KEYS.ADMIN_ACCOUNTS, updatedList);
    this.setCurrentAdmin(updatedAdmin);
    this.setActiveRole('admin');

    this.logAdminAuditAction({
      actor: `${updatedAdmin.name} (${updatedAdmin.role})`,
      actorEmail: updatedAdmin.email,
      action: 'ADMIN_LOGIN',
      category: 'Authentication',
      target: `Session: ${updatedAdmin.username}`,
      details: 'Successful authenticated login session established from admin portal.'
    });

    return { success: true, admin: updatedAdmin };
  }

  adminLogout() {
    const current = this.getCurrentAdmin();
    if (current) {
      this.logAdminAuditAction({
        actor: `${current.name} (${current.role})`,
        actorEmail: current.email,
        action: 'ADMIN_LOGOUT',
        category: 'Authentication',
        target: `Session: ${current.username}`,
        details: 'Admin closed session and logged out securely.'
      });
    }
    this.setCurrentAdmin(null);
    if (this.getActiveRole() === 'admin') {
      this.clearActiveRole();
    }
    return { success: true };
  }

  updateAdminProfile(adminId, updates) {
    const admins = this.getAdminAccounts();
    const index = admins.findIndex((a) => a.id === adminId);
    if (index === -1) return { success: false, message: 'Admin not found' };

    const updated = { ...admins[index], ...updates };
    admins[index] = updated;
    this.set(STORAGE_KEYS.ADMIN_ACCOUNTS, admins);

    const current = this.getCurrentAdmin();
    if (current && current.id === adminId) {
      this.setCurrentAdmin(updated);
    }

    this.logAdminAuditAction({
      actor: updated.name,
      actorEmail: updated.email,
      action: 'PROFILE_UPDATE',
      category: 'Admin Security',
      target: `Admin: ${updated.id}`,
      details: 'Updated administrative profile information.'
    });

    return { success: true, admin: updated };
  }

  getAdminDashboardStats() {
    const customers = this.getCustomers();
    const farmers = this.getFarmers();
    const partners = this.getDeliveryPartners();
    const products = this.getProducts();
    const orders = this.getOrders();
    const settings = this.getPlatformSettings();
    const complaints = this.getAllComplaints();

    const commissionRate = settings.platformFeeRate || 10;

    let totalGmv = 0;
    let completedOrdersCount = 0;
    let activeOrdersCount = 0;
    let cancelledOrdersCount = 0;

    orders.forEach((o) => {
      const orderTotal = o.totalAmount || o.finalAmount || o.pricing?.total || 0;
      totalGmv += orderTotal;
      if (o.orderStatus === 'Delivered') completedOrdersCount++;
      else if (o.orderStatus === 'Cancelled') cancelledOrdersCount++;
      else activeOrdersCount++;
    });

    const platformCommissionEarned = Math.round(totalGmv * (commissionRate / 100));
    const netFarmerPayouts = Math.max(0, totalGmv - platformCommissionEarned - (completedOrdersCount * 50));
    const deliveryPayouts = completedOrdersCount * 145;

    const approvedFarmers = farmers.filter((f) => f.verificationStatus === 'Approved').length;
    const pendingFarmers = farmers.filter((f) => f.verificationStatus === 'Pending' || !f.verificationStatus).length;
    const approvedPartners = partners.filter((p) => p.verificationStatus === 'Approved').length;
    const onlinePartners = partners.filter((p) => p.isOnline).length;
    const pendingProducts = products.filter((p) => p.approvalStatus === 'Pending' || p.approvalStatus === 'Under Review').length;
    const outOfStockProducts = products.filter((p) => (p.stock || p.quantity || 0) <= 0).length;

    const categoryCounts = {};
    products.forEach((p) => {
      const c = p.category || 'other';
      categoryCounts[c] = (categoryCounts[c] || 0) + 1;
    });

    return {
      totalUsers: customers.length + farmers.length + partners.length + 3,
      customers: {
        total: customers.length,
        active: customers.filter((c) => c.status !== 'Suspended').length,
        suspended: customers.filter((c) => c.status === 'Suspended').length
      },
      farmers: {
        total: farmers.length,
        approved: approvedFarmers,
        pending: pendingFarmers,
        rejected: farmers.filter((f) => f.verificationStatus === 'Rejected').length,
        suspended: farmers.filter((f) => f.status === 'Suspended').length
      },
      deliveryPartners: {
        total: partners.length,
        approved: approvedPartners,
        pending: partners.filter((p) => p.verificationStatus === 'Pending').length,
        online: onlinePartners,
        offline: partners.length - onlinePartners
      },
      products: {
        total: products.length,
        active: products.filter((p) => p.status === 'Active' && p.approvalStatus !== 'Pending').length,
        pendingApproval: pendingProducts,
        outOfStock: outOfStockProducts,
        categoryCounts
      },
      orders: {
        total: orders.length,
        active: activeOrdersCount,
        completed: completedOrdersCount,
        cancelled: cancelledOrdersCount
      },
      financials: {
        totalGmv,
        platformCommissionEarned,
        netFarmerPayouts,
        deliveryPayouts,
        commissionRate
      },
      complaints: {
        total: complaints.length,
        open: complaints.filter((c) => c.status === 'Open' || c.status === 'Pending').length,
        inProgress: complaints.filter((c) => c.status === 'In Progress').length,
        resolved: complaints.filter((c) => c.status === 'Resolved').length
      }
    };
  }

  getAllFarmersAdmin() {
    const farmers = this.getFarmers();
    const products = this.getProducts();
    const orders = this.getOrders();

    return farmers.map((f) => {
      f.fullName = f.fullName || f.name;
      f.name = f.fullName || f.name;
      const farmerProducts = products.filter((p) => p.farmerId === f.id);
      const farmerOrders = orders.filter((o) =>
        (o.items || []).some((item) => item.farmerId === f.id || item.farmerName === f.fullName || item.farmerName === f.farmName)
      );

      const totalRevenue = farmerOrders.reduce((sum, o) => sum + (o.totalAmount || o.finalAmount || o.pricing?.total || 0), 0);

      return {
        ...f,
        productsCount: farmerProducts.length,
        ordersCount: farmerOrders.length,
        totalRevenue: Math.round(totalRevenue * 0.9),
        documents: f.documents || {
          landRecord: 'Land_Title_7-12_Extract.pdf',
          organicCert: f.isOrganic ? 'NPOP_Organic_Certificate_2026.pdf' : null,
          idProof: 'Aadhaar_KYC_Verified.pdf',
          soilHealthCard: 'Soil_Health_Card_2025.pdf'
        }
      };
    });
  }

  adminApproveFarmer(farmerId, notes, actor = 'Admin') {
    const farmers = this.getFarmers();
    const index = farmers.findIndex((f) => f.id === farmerId);
    if (index === -1) return { success: false, message: 'Farmer not found' };

    farmers[index].fullName = farmers[index].fullName || farmers[index].name;
    farmers[index].verificationStatus = 'Approved';
    farmers[index].verificationBadge = 'Verified Organic Grower';
    farmers[index].verifiedAt = new Date().toISOString();
    farmers[index].adminFeedback = notes || 'All land records, cultivation certificates, and identity proofs verified successfully.';
    farmers[index].status = 'Active';

    this.set(STORAGE_KEYS.FARMERS, farmers);

    this.addNotification({
      farmerId,
      type: 'VERIFICATION_APPROVED',
      title: 'Congratulations! Farmer Verification Approved 🎉',
      message: 'Your farm profile has been officially certified by Farm to Home administrators. Your listings are now live to buyers.'
    });

    this.logAdminAuditAction({
      actor,
      action: 'APPROVE_FARMER',
      category: 'Farmer Management',
      target: `${farmers[index].farmName || farmers[index].fullName || farmers[index].name} (${farmerId})`,
      details: notes || 'Approved farmer accreditation and enabled marketplace sales.'
    });

    return { success: true, farmer: farmers[index] };
  }

  adminRejectFarmer(farmerId, reason, actor = 'Admin') {
    const farmers = this.getFarmers();
    const index = farmers.findIndex((f) => f.id === farmerId);
    if (index === -1) return { success: false, message: 'Farmer not found' };

    farmers[index].verificationStatus = 'Rejected';
    farmers[index].rejectionReason = reason;
    farmers[index].adminFeedback = reason;
    farmers[index].rejectedAt = new Date().toISOString();

    this.set(STORAGE_KEYS.FARMERS, farmers);

    this.addNotification({
      farmerId,
      type: 'VERIFICATION_REJECTED',
      title: 'Farmer Verification Needs Resubmission ⚠️',
      message: `Your verification could not be approved: ${reason}. Please update your documents in the verification tab.`
    });

    this.logAdminAuditAction({
      actor,
      action: 'REJECT_FARMER',
      category: 'Farmer Management',
      target: `${farmers[index].farmName || farmers[index].fullName || farmers[index].name} (${farmerId})`,
      details: `Verification rejected: ${reason}`
    });

    return { success: true, farmer: farmers[index] };
  }

  adminToggleFarmerSuspension(farmerId, justification, actor = 'Admin') {
    const farmers = this.getFarmers();
    const index = farmers.findIndex((f) => f.id === farmerId);
    if (index === -1) return { success: false, message: 'Farmer not found' };

    const currentStatus = farmers[index].status || 'Active';
    const newStatus = currentStatus === 'Suspended' ? 'Active' : 'Suspended';

    farmers[index].status = newStatus;
    if (newStatus === 'Suspended') {
      farmers[index].suspensionReason = justification || 'Account under administrative review';
      farmers[index].suspendedAt = new Date().toISOString();
    } else {
      delete farmers[index].suspensionReason;
      delete farmers[index].suspendedAt;
    }

    this.set(STORAGE_KEYS.FARMERS, farmers);

    this.logAdminAuditAction({
      actor,
      action: newStatus === 'Suspended' ? 'SUSPEND_FARMER' : 'REACTIVATE_FARMER',
      category: 'Farmer Management',
      target: `${farmers[index].farmName || farmers[index].fullName || farmers[index].name} (${farmerId})`,
      details: newStatus === 'Suspended' ? `Suspension justification: ${justification}` : 'Account reactivated by administrator'
    });

    return { success: true, farmer: farmers[index], newStatus };
  }

  getCustomers() {
    return this.get(STORAGE_KEYS.CUSTOMERS) || INITIAL_CUSTOMERS;
  }

  adminToggleCustomerSuspension(customerId, justification, actor = 'Admin') {
    const customers = this.getCustomers();
    const index = customers.findIndex((c) => c.id === customerId);
    if (index === -1) return { success: false, message: 'Customer not found' };

    const current = customers[index].status || 'Active';
    const newStatus = current === 'Suspended' ? 'Active' : 'Suspended';

    customers[index].status = newStatus;
    if (newStatus === 'Suspended') {
      customers[index].suspensionReason = justification || 'Administrative policy violation';
      customers[index].suspendedAt = new Date().toISOString();
    } else {
      delete customers[index].suspensionReason;
      delete customers[index].suspendedAt;
    }

    this.set(STORAGE_KEYS.CUSTOMERS, customers);

    this.logAdminAuditAction({
      actor,
      action: newStatus === 'Suspended' ? 'SUSPEND_CUSTOMER' : 'REACTIVATE_CUSTOMER',
      category: 'Customer Management',
      target: `${customers[index].fullName} (${customerId})`,
      details: newStatus === 'Suspended' ? `Suspended: ${justification}` : 'Customer access restored'
    });

    return { success: true, customer: customers[index], newStatus };
  }

  getAllDeliveryPartnersAdmin() {
    const partners = this.getDeliveryPartners();
    const assignments = this.getDeliveryAssignments();

    return partners.map((p) => {
      p.fullName = p.fullName || p.name;
      p.name = p.fullName || p.name;
      const partnerJobs = assignments.filter((j) => j.partnerId === p.id);
      const deliveredCount = partnerJobs.filter((j) => j.status === 'Delivered').length;
      const earnings = partnerJobs
        .filter((j) => j.status === 'Delivered')
        .reduce((sum, j) => sum + (j.payout?.total || 150), 0);

      return {
        ...p,
        completedDeliveries: deliveredCount || p.completedTrips || 0,
        totalEarnings: earnings || 0,
        activeJobsCount: partnerJobs.filter((j) => ['Assigned', 'Accepted', 'Arrived at farm', 'Picked up', 'In transit'].includes(j.status)).length
      };
    });
  }

  adminApproveDeliveryPartner(partnerId, notes, actor = 'Admin') {
    const partners = this.getDeliveryPartners();
    const index = partners.findIndex((p) => p.id === partnerId);
    if (index === -1) return { success: false, message: 'Delivery partner not found' };

    partners[index].fullName = partners[index].fullName || partners[index].name;
    partners[index].verificationStatus = 'Approved';
    partners[index].adminFeedback = notes || 'All driving documents, registration credentials, and ID proofs verified.';
    partners[index].approvedAt = new Date().toISOString();

    this.set(STORAGE_KEYS.DELIVERY_PARTNERS, partners);

    this.addDeliveryNotification({
      partnerId,
      type: 'VERIFICATION_APPROVED',
      title: 'Onboarding Approved! Welcome to Farm to Home 🚀',
      message: 'Your courier profile is fully approved. Toggle your status to Online to begin receiving delivery requests.'
    });

    this.logAdminAuditAction({
      actor,
      action: 'APPROVE_RIDER',
      category: 'Delivery Management',
      target: `${partners[index].fullName || partners[index].name} (${partnerId})`,
      details: notes || 'Delivery partner approved for platform deliveries.'
    });

    return { success: true, partner: partners[index] };
  }

  adminRejectDeliveryPartner(partnerId, reason, actor = 'Admin') {
    const partners = this.getDeliveryPartners();
    const index = partners.findIndex((p) => p.id === partnerId);
    if (index === -1) return { success: false, message: 'Delivery partner not found' };

    partners[index].verificationStatus = 'Rejected';
    partners[index].rejectionReason = reason;
    partners[index].adminFeedback = reason;
    partners[index].rejectedAt = new Date().toISOString();

    this.set(STORAGE_KEYS.DELIVERY_PARTNERS, partners);

    this.addDeliveryNotification({
      partnerId,
      type: 'VERIFICATION_REJECTED',
      title: 'Document Resubmission Required ⚠️',
      message: `Your verification was rejected: ${reason}. Please re-upload valid documents.`
    });

    this.logAdminAuditAction({
      actor,
      action: 'REJECT_RIDER',
      category: 'Delivery Management',
      target: `${partners[index].fullName || partners[index].name} (${partnerId})`,
      details: `Delivery partner rejected: ${reason}`
    });

    return { success: true, partner: partners[index] };
  }

  adminTogglePartnerSuspension(partnerId, justification, actor = 'Admin') {
    const partners = this.getDeliveryPartners();
    const index = partners.findIndex((p) => p.id === partnerId);
    if (index === -1) return { success: false, message: 'Delivery partner not found' };

    const current = partners[index].status || 'Active';
    const newStatus = current === 'Suspended' ? 'Active' : 'Suspended';

    partners[index].status = newStatus;
    if (newStatus === 'Suspended') {
      partners[index].isOnline = false;
      partners[index].suspensionReason = justification || 'Administrative courier review';
      partners[index].suspendedAt = new Date().toISOString();
    } else {
      delete partners[index].suspensionReason;
      delete partners[index].suspendedAt;
    }

    this.set(STORAGE_KEYS.DELIVERY_PARTNERS, partners);

    this.logAdminAuditAction({
      actor,
      action: newStatus === 'Suspended' ? 'SUSPEND_RIDER' : 'REACTIVATE_RIDER',
      category: 'Delivery Management',
      target: `${partners[index].fullName || partners[index].name} (${partnerId})`,
      details: newStatus === 'Suspended' ? `Suspension: ${justification}` : 'Delivery partner account reactivated'
    });

    return { success: true, partner: partners[index], newStatus };
  }

  getAllProductsAdmin() {
    const products = this.getProducts();
    const farmers = this.getFarmers();
    const farmerMap = {};
    farmers.forEach((f) => {
      farmerMap[f.id] = f.farmName || f.fullName;
    });

    return products.map((p) => ({
      ...p,
      farmerDisplayName: farmerMap[p.farmerId] || p.farmerName || 'Registered Local Farm',
      approvalStatus: p.approvalStatus || (p.status === 'Active' ? 'Approved' : 'Pending'),
      reportCount: p.reportCount || 0
    }));
  }

  adminApproveProduct(productId, actor = 'Admin') {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === productId);
    if (index === -1) return { success: false, message: 'Product not found' };

    products[index].status = 'Active';
    products[index].approvalStatus = 'Approved';
    products[index].approvedAt = new Date().toISOString();
    delete products[index].rejectionReason;

    this.set(STORAGE_KEYS.PRODUCTS, products);

    if (products[index].farmerId) {
      this.addNotification({
        farmerId: products[index].farmerId,
        type: 'PRODUCT_APPROVED',
        title: 'Listing Approved for Sale ✨',
        message: `Your listing for "${products[index].name}" has passed platform quality guidelines and is now public to customers.`
      });
    }

    this.logAdminAuditAction({
      actor,
      action: 'APPROVE_PRODUCT',
      category: 'Product Moderation',
      target: `${products[index].name} (${productId})`,
      details: 'Approved product listing for public discovery.'
    });

    return { success: true, product: products[index] };
  }

  adminRejectProduct(productId, reason, actor = 'Admin') {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === productId);
    if (index === -1) return { success: false, message: 'Product not found' };

    products[index].status = 'Inactive';
    products[index].approvalStatus = 'Rejected';
    products[index].rejectionReason = reason;

    this.set(STORAGE_KEYS.PRODUCTS, products);

    if (products[index].farmerId) {
      this.addNotification({
        farmerId: products[index].farmerId,
        type: 'PRODUCT_REJECTED',
        title: 'Listing Requires Modification ⚠️',
        message: `Listing for "${products[index].name}" was flagged: ${reason}. Please update details to resubmit.`
      });
    }

    this.logAdminAuditAction({
      actor,
      action: 'REJECT_PRODUCT',
      category: 'Product Moderation',
      target: `${products[index].name} (${productId})`,
      details: `Listing rejected: ${reason}`
    });

    return { success: true, product: products[index] };
  }

  adminRemoveProduct(productId, reason, actor = 'Admin') {
    const products = this.getProducts();
    const targetProduct = products.find((p) => p.id === productId);
    const updated = products.filter((p) => p.id !== productId);
    this.set(STORAGE_KEYS.PRODUCTS, updated);

    this.logAdminAuditAction({
      actor,
      action: 'REMOVE_PRODUCT',
      category: 'Product Moderation',
      target: targetProduct ? `${targetProduct.name} (${productId})` : productId,
      details: `Permanently removed prohibited/misleading item: ${reason}`
    });

    return { success: true };
  }

  getCategories() {
    const stored = this.get(STORAGE_KEYS.CATEGORIES);
    const categories = stored || INITIAL_CATEGORIES;
    const products = this.getProducts();

    return categories.map((cat) => {
      const count = products.filter(
        (p) =>
          (p.category && p.category.toLowerCase() === (cat.slug || '').toLowerCase()) ||
          (p.category && p.category.toLowerCase() === (cat.name || '').toLowerCase())
      ).length;
      return {
        ...cat,
        productCount: count
      };
    });
  }

  adminAddCategory(categoryData, actor = 'Admin') {
    const categories = this.get(STORAGE_KEYS.CATEGORIES) || INITIAL_CATEGORIES;
    const slug = (categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-')).trim();

    if (categories.some((c) => c.slug === slug)) {
      return { success: false, message: `Category with slug "${slug}" already exists.` };
    }

    const newCategory = {
      id: `cat-${Date.now().toString().slice(-4)}`,
      slug,
      name: categoryData.name,
      icon: categoryData.icon || 'Carrot',
      description: categoryData.description || '',
      active: categoryData.active !== undefined ? categoryData.active : true,
      displayOrder: categories.length + 1
    };

    categories.push(newCategory);
    this.set(STORAGE_KEYS.CATEGORIES, categories);

    this.logAdminAuditAction({
      actor,
      action: 'CREATE_CATEGORY',
      category: 'Taxonomy & Catalog',
      target: `${newCategory.name} (${newCategory.slug})`,
      details: 'Created new product classification category.'
    });

    return { success: true, category: newCategory };
  }

  adminUpdateCategory(categoryId, categoryData, actor = 'Admin') {
    const categories = this.get(STORAGE_KEYS.CATEGORIES) || INITIAL_CATEGORIES;
    const index = categories.findIndex((c) => c.id === categoryId);
    if (index === -1) return { success: false, message: 'Category not found' };

    const updated = { ...categories[index], ...categoryData };
    categories[index] = updated;
    this.set(STORAGE_KEYS.CATEGORIES, categories);

    this.logAdminAuditAction({
      actor,
      action: 'UPDATE_CATEGORY',
      category: 'Taxonomy & Catalog',
      target: `${updated.name} (${updated.slug})`,
      details: 'Updated category metadata and active display properties.'
    });

    return { success: true, category: updated };
  }

  adminToggleCategoryStatus(categoryId, actor = 'Admin') {
    const categories = this.get(STORAGE_KEYS.CATEGORIES) || INITIAL_CATEGORIES;
    const index = categories.findIndex((c) => c.id === categoryId);
    if (index === -1) return { success: false, message: 'Category not found' };

    categories[index].active = !categories[index].active;
    this.set(STORAGE_KEYS.CATEGORIES, categories);

    this.logAdminAuditAction({
      actor,
      action: 'TOGGLE_CATEGORY',
      category: 'Taxonomy & Catalog',
      target: `${categories[index].name} (${categories[index].slug})`,
      details: `Category status updated to ${categories[index].active ? 'Active' : 'Hidden'}.`
    });

    return { success: true, category: categories[index] };
  }

  adminDeleteCategory(categoryId, actor = 'Admin') {
    const categories = this.get(STORAGE_KEYS.CATEGORIES) || INITIAL_CATEGORIES;
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return { success: false, message: 'Category not found' };

    const products = this.getProducts();
    const dependentProducts = products.filter(
      (p) =>
        (p.category && p.category.toLowerCase() === (category.slug || '').toLowerCase()) ||
        (p.category && p.category.toLowerCase() === (category.name || '').toLowerCase())
    );

    if (dependentProducts.length > 0) {
      return {
        success: false,
        error: `Cannot delete "${category.name}" because ${dependentProducts.length} active products belong to this category. Please reassign or delete these products first.`,
        count: dependentProducts.length,
        dependentProducts: dependentProducts.map((p) => ({ id: p.id, name: p.name }))
      };
    }

    const filtered = categories.filter((c) => c.id !== categoryId);
    this.set(STORAGE_KEYS.CATEGORIES, filtered);

    this.logAdminAuditAction({
      actor,
      action: 'DELETE_CATEGORY',
      category: 'Taxonomy & Catalog',
      target: `${category.name} (${category.slug})`,
      details: 'Deleted unused product category with 0 dependent listings.'
    });

    return { success: true };
  }

  getAllOrdersAdmin() {
    const orders = this.getOrders();
    const assignments = this.getDeliveryAssignments();
    const partnerMap = {};
    const partners = this.getDeliveryPartners();
    partners.forEach((p) => {
      partnerMap[p.id] = p;
    });

    return orders.map((o) => {
      const assignment = assignments.find((a) => a.orderId === o.id);
      const courier = assignment && assignment.partnerId ? partnerMap[assignment.partnerId] : null;

      return {
        ...o,
        assignedCourier: courier ? { id: courier.id, name: courier.fullName, phone: courier.mobile } : null,
        courierAssignmentStatus: assignment ? assignment.status : (o.deliveryMethod === 'farmer' ? 'Farmer Self-Dispatch' : 'Unassigned'),
        assignmentId: assignment ? assignment.id : null
      };
    });
  }

  adminCancelOrder(orderId, { reason, processRefund, actor = 'Admin' }) {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return { success: false, message: 'Order not found' };

    const order = orders[index];
    const nowIso = new Date().toISOString();

    order.orderStatus = 'Cancelled';
    order.cancellationReason = reason || 'Cancelled by Platform Administrator';
    order.cancelledAt = nowIso;
    order.cancelledBy = actor;

    if (processRefund && (order.paymentStatus === 'Paid' || order.paymentMethod !== 'cash_on_delivery')) {
      order.paymentStatus = 'Refunded';
      order.refundTransactionId = `REFUND-${Date.now().toString().slice(-6)}`;
      order.refundedAt = nowIso;
      order.refundAmount = order.finalAmount || order.pricing?.total || 0;
    }

    order.trackingTimeline = order.trackingTimeline || [];
    order.trackingTimeline.push({
      status: 'Cancelled',
      timestamp: nowIso,
      note: `Order cancelled by administrative control: ${reason || 'Administrative intervention'}. ${
        processRefund ? 'Refund initiated.' : ''
      }`
    });

    orders[index] = order;
    this.set(STORAGE_KEYS.ORDERS, orders);

    const assignments = this.getDeliveryAssignments();
    const updatedAssignments = assignments.map((a) => {
      if (a.orderId === orderId) {
        return {
          ...a,
          status: 'Cancelled',
          cancelReason: `Order cancelled by admin: ${reason}`
        };
      }
      return a;
    });
    this.set(STORAGE_KEYS.DELIVERY_ASSIGNMENTS, updatedAssignments);

    this.logAdminAuditAction({
      actor,
      action: 'CANCEL_ORDER',
      category: 'Order Dispatch',
      target: `Order #${orderId}`,
      details: `Cancelled order. Reason: ${reason}. ${processRefund ? `Full refund of ₹${order.finalAmount || order.pricing?.total} recorded.` : ''}`
    });

    return { success: true, order };
  }

  adminReassignDelivery(orderId, newPartnerId, actor = 'Admin') {
    const assignments = this.getDeliveryAssignments();
    const partners = this.getDeliveryPartners();
    const partner = partners.find((p) => p.id === newPartnerId);

    if (!partner) return { success: false, message: 'Delivery partner not found' };

    let assignmentIndex = assignments.findIndex((a) => a.orderId === orderId);
    const nowIso = new Date().toISOString();

    if (assignmentIndex >= 0) {
      assignments[assignmentIndex].partnerId = newPartnerId;
      assignments[assignmentIndex].partnerName = partner.fullName;
      assignments[assignmentIndex].status = 'Assigned';
      assignments[assignmentIndex].reassignedAt = nowIso;
      assignments[assignmentIndex].timeline = assignments[assignmentIndex].timeline || [];
      assignments[assignmentIndex].timeline.push({
        status: 'Assigned',
        timestamp: nowIso,
        note: `Order reassigned by admin to ${partner.fullName}`
      });
    } else {
      const order = this.getOrderById(orderId);
      const newJob = {
        id: `JOB-${Date.now().toString().slice(-5)}`,
        orderId,
        orderNumber: order ? (order.orderNumber || order.id) : orderId,
        partnerId: newPartnerId,
        partnerName: partner.fullName,
        status: 'Assigned',
        createdAt: nowIso,
        deliveryMethod: 'platform',
        timeline: [
          { status: 'Assigned', timestamp: nowIso, note: `Assigned directly by platform administrator to ${partner.fullName}` }
        ]
      };
      assignments.unshift(newJob);
    }

    this.set(STORAGE_KEYS.DELIVERY_ASSIGNMENTS, assignments);

    this.addDeliveryNotification({
      partnerId: newPartnerId,
      type: 'NEW_DELIVERY_REQUEST',
      title: 'Direct Dispatch Assignment 📦',
      message: `You have been directly assigned delivery for Order #${orderId}. Please check your active deliveries.`
    });

    this.logAdminAuditAction({
      actor,
      action: 'REASSIGN_DELIVERY',
      category: 'Dispatch Management',
      target: `Order #${orderId}`,
      details: `Delivery reassigned to courier ${partner.fullName} (${newPartnerId}).`
    });

    return { success: true };
  }

  getAllPaymentsAdmin() {
    const orders = this.getOrders();

    return orders.map((o) => {
      const amount = o.totalAmount || o.finalAmount || o.pricing?.total || 0;
      const isCod = o.paymentMethod === 'cash_on_delivery' || o.paymentMethod === 'cod';
      const paymentStatus = o.paymentStatus || (isCod ? (o.orderStatus === 'Delivered' ? 'Paid' : 'Pending') : 'Paid');
      const txnId = o.paymentTransactionId || o.transactionId || `TXN-UPI-${(o.id || '000').replace(/\D/g, '') || '98762'}`;

      return {
        id: `PAY-${o.id}`,
        orderId: o.id,
        orderNumber: o.orderNumber || o.id,
        customerName: o.customerName || o.shippingAddress?.fullName || o.deliveryAddress?.fullName || 'Customer',
        customerPhone: o.customerPhone || o.shippingAddress?.phone || o.deliveryAddress?.mobile || '+91 98765 00000',
        amount,
        commissionFee: Math.round(amount * 0.1),
        farmerPayout: Math.round(amount * 0.9),
        paymentMethod: isCod ? 'Cash on Delivery (COD)' : (o.paymentMethod || 'UPI / NetBanking'),
        gateway: isCod ? 'Doorstep Cash Collection' : 'Razorpay Secure Gateway',
        transactionId: txnId,
        status: paymentStatus,
        refundTransactionId: o.refundTransactionId || null,
        refundAmount: o.refundAmount || 0,
        createdAt: o.createdAt || new Date().toISOString()
      };
    });
  }

  adminProcessRefund(orderId, { refundAmount, reason, actor = 'Admin' }) {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return { success: false, message: 'Order record not found.' };

    const order = orders[index];
    const amountToRefund = refundAmount !== undefined ? Number(refundAmount) : (order.totalAmount || order.finalAmount || order.pricing?.total || 0);

    const nowIso = new Date().toISOString();
    const refundTxnId = `RFND-RZP-${Date.now().toString().slice(-6)}`;

    order.paymentStatus = 'Refunded';
    order.refundTransactionId = refundTxnId;
    order.refundAmount = amountToRefund;
    order.refundReason = reason || 'Customer dispute resolution';
    order.refundedAt = nowIso;

    order.trackingTimeline = order.trackingTimeline || [];
    order.trackingTimeline.push({
      status: 'Refunded',
      timestamp: nowIso,
      note: `Administrative refund of ₹${amountToRefund} processed via gateway. Ref: ${refundTxnId}`
    });

    orders[index] = order;
    this.set(STORAGE_KEYS.ORDERS, orders);

    this.logAdminAuditAction({
      actor,
      action: 'PROCESS_REFUND',
      category: 'Financial Settlements',
      target: `Order #${orderId}`,
      details: `Disbursed refund of ₹${amountToRefund}. Reason: ${reason || 'Policy satisfaction'}. Ref: ${refundTxnId}`
    });

    return {
      success: true,
      refundTransactionId: refundTxnId,
      refundAmount: amountToRefund,
      order
    };
  }

  getAllComplaints() {
    const complaints = this.get(STORAGE_KEYS.COMPLAINTS) || INITIAL_COMPLAINTS;
    const deliveryTickets = this.get(STORAGE_KEYS.DELIVERY_TICKETS) || INITIAL_DELIVERY_TICKETS;

    const courierTickets = deliveryTickets.map((t) => ({
      id: t.id,
      ticketType: 'Courier / Rider',
      userRole: 'delivery_partner',
      userName: t.partnerName || 'Field Courier',
      orderId: t.orderId || 'N/A',
      category: t.category || 'Transit',
      subject: t.subject || 'Courier Escalation',
      description: t.description || 'Courier issue reported during fulfillment',
      status: t.status || 'Open',
      priority: t.priority || 'Medium',
      createdAt: t.createdAt || new Date().toISOString(),
      assignedTo: t.assignedTo || 'Unassigned',
      resolution: t.resolution || null
    }));

    const combined = [...complaints, ...courierTickets];
    const unique = [];
    const seen = new Set();
    combined.forEach((item) => {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        unique.push(item);
      }
    });

    return unique.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  adminAssignComplaint(complaintId, assignedTo, actor = 'Admin') {
    const complaints = this.get(STORAGE_KEYS.COMPLAINTS) || INITIAL_COMPLAINTS;
    const index = complaints.findIndex((c) => c.id === complaintId);

    if (index >= 0) {
      complaints[index].assignedTo = assignedTo;
      if (complaints[index].status === 'Open' || complaints[index].status === 'Pending') {
        complaints[index].status = 'In Progress';
      }
      this.set(STORAGE_KEYS.COMPLAINTS, complaints);
    }

    const tickets = this.get(STORAGE_KEYS.DELIVERY_TICKETS) || INITIAL_DELIVERY_TICKETS;
    const tIndex = tickets.findIndex((t) => t.id === complaintId);
    if (tIndex >= 0) {
      tickets[tIndex].assignedTo = assignedTo;
      tickets[tIndex].status = 'In Progress';
      this.set(STORAGE_KEYS.DELIVERY_TICKETS, tickets);
    }

    this.logAdminAuditAction({
      actor,
      action: 'ASSIGN_COMPLAINT',
      category: 'Customer Support',
      target: `Ticket #${complaintId}`,
      details: `Assigned resolution ownership to ${assignedTo}.`
    });

    return { success: true };
  }

  adminResolveComplaint(complaintId, { resolution, actor = 'Admin' }) {
    const nowIso = new Date().toISOString();
    const complaints = this.get(STORAGE_KEYS.COMPLAINTS) || INITIAL_COMPLAINTS;
    const index = complaints.findIndex((c) => c.id === complaintId);

    if (index >= 0) {
      complaints[index].status = 'Resolved';
      complaints[index].resolution = resolution || 'Resolved by administrative team.';
      complaints[index].resolvedAt = nowIso;
      complaints[index].resolvedBy = actor;
      this.set(STORAGE_KEYS.COMPLAINTS, complaints);
    }

    const tickets = this.get(STORAGE_KEYS.DELIVERY_TICKETS) || INITIAL_DELIVERY_TICKETS;
    const tIndex = tickets.findIndex((t) => t.id === complaintId);
    if (tIndex >= 0) {
      tickets[tIndex].status = 'Resolved';
      tickets[tIndex].resolution = resolution || 'Resolved by administrative team.';
      tickets[tIndex].resolvedAt = nowIso;
      tickets[tIndex].resolvedBy = actor;
      this.set(STORAGE_KEYS.DELIVERY_TICKETS, tickets);
    }

    this.logAdminAuditAction({
      actor,
      action: 'RESOLVE_COMPLAINT',
      category: 'Customer Support',
      target: `Ticket #${complaintId}`,
      details: `Resolved ticket: ${resolution}`
    });

    return { success: true };
  }

  getPlatformSettings() {
    return this.get(STORAGE_KEYS.PLATFORM_SETTINGS) || INITIAL_PLATFORM_SETTINGS;
  }

  updatePlatformSettings(newSettings, actor = 'Admin') {
    const current = this.getPlatformSettings();
    const updated = { ...current, ...newSettings };
    this.set(STORAGE_KEYS.PLATFORM_SETTINGS, updated);

    this.logAdminAuditAction({
      actor,
      action: 'UPDATE_CONFIG',
      category: 'Platform Settings',
      target: 'Platform Global Configuration',
      details: `Commission rate: ${updated.platformFeeRate}%, Base delivery: ₹${updated.baseDeliveryFee}`
    });

    return { success: true, settings: updated };
  }

  getBroadcastAnnouncements() {
    return this.get(STORAGE_KEYS.ANNOUNCEMENTS) || INITIAL_ANNOUNCEMENTS;
  }

  createBroadcastAnnouncement({ title, target, message, sender }, actor = 'Admin') {
    const list = this.getBroadcastAnnouncements();
    const newAnn = {
      id: `ANN-${Date.now().toString().slice(-4)}`,
      title,
      target: target || 'all',
      message,
      sender: sender || actor,
      createdAt: new Date().toISOString(),
      readCount: 0
    };

    list.unshift(newAnn);
    this.set(STORAGE_KEYS.ANNOUNCEMENTS, list);

    if (target === 'farmers' || target === 'all') {
      const farmers = this.getFarmers();
      farmers.forEach((f) => {
        this.addNotification({
          farmerId: f.id,
          type: 'BROADCAST',
          title: `Announcement: ${title}`,
          message
        });
      });
    }

    if (target === 'delivery' || target === 'all') {
      const partners = this.getDeliveryPartners();
      partners.forEach((p) => {
        this.addDeliveryNotification({
          partnerId: p.id,
          type: 'BROADCAST',
          title: `Announcement: ${title}`,
          message
        });
      });
    }

    this.logAdminAuditAction({
      actor,
      action: 'SEND_ANNOUNCEMENT',
      category: 'Platform Broadcasts',
      target: `Target: ${target.toUpperCase()}`,
      details: `Broadcast: "${title}"`
    });

    return { success: true, announcement: newAnn };
  }

  getAuditLogs() {
    const logs = this.get(STORAGE_KEYS.AUDIT_LOGS) || INITIAL_AUDIT_LOGS;
    return [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  logAdminAuditAction({ actor, actorEmail, action, category, target, details, ip }) {
    const logs = this.get(STORAGE_KEYS.AUDIT_LOGS) || INITIAL_AUDIT_LOGS;
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      actor: actor || 'Admin User',
      actorEmail: actorEmail || 'admin@farmtohome.in',
      action,
      category: category || 'Administration',
      target: target || 'General',
      details: details || '',
      timestamp: new Date().toISOString(),
      ip: ip || '192.168.1.101'
    };

    logs.unshift(newLog);
    if (logs.length > 100) logs.pop();
    this.set(STORAGE_KEYS.AUDIT_LOGS, logs);
    return newLog;
  }

  // Clear or reset for testing
  resetToInitial() {
    safeStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify([]));
    safeStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
    safeStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
    safeStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    safeStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    safeStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify([]));
    safeStorage.setItem(STORAGE_KEYS.DELIVERY_PARTNERS, JSON.stringify([]));
    safeStorage.setItem(STORAGE_KEYS.DELIVERY_ASSIGNMENTS, JSON.stringify([]));
    safeStorage.setItem(STORAGE_KEYS.DELIVERY_NOTIFICATIONS, JSON.stringify([]));
    safeStorage.setItem(STORAGE_KEYS.DELIVERY_TICKETS, JSON.stringify([]));
    safeStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify([]));
    safeStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
    safeStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }

  clearProductsForEmptyStateTest() {
    this.set(STORAGE_KEYS.PRODUCTS, []);
  }
}

export const storageService = new StorageService();
export { STORAGE_KEYS };
