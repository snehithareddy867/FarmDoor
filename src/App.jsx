import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { FarmerAuthProvider } from './context/FarmerAuthContext';
import { DeliveryAuthProvider } from './context/DeliveryAuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';

// Public & Landing & Unified Authentication
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/auth/AuthPage';
import ForgotPasswordPage from './pages/customer/ForgotPasswordPage';

// Customer Protected Components & Layout
import CustomerLayout from './components/customer/CustomerLayout';
import CustomerProtectedRoute from './components/customer/CustomerProtectedRoute';

// Customer Pages
import DashboardPage from './pages/customer/DashboardPage';
import MarketplacePage from './pages/customer/MarketplacePage';
import ProductDetailsPage from './pages/customer/ProductDetailsPage';
import CatalogueExplorerPage from './pages/customer/CatalogueExplorerPage';
import FarmerProfilePage from './pages/customer/FarmerProfilePage';
import CartPage from './pages/customer/CartPage';
import WishlistPage from './pages/customer/WishlistPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';
import OrdersPage from './pages/customer/OrdersPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import ProfilePage from './pages/customer/ProfilePage';
import PaymentsPage from './pages/customer/PaymentsPage';
import ReviewsPage from './pages/customer/ReviewsPage';
import NotificationsPage from './pages/customer/NotificationsPage';
import SupportPage from './pages/customer/SupportPage';

// Farmer Module
import FarmerRegisterPage from './pages/farmer/FarmerRegisterPage';
import FarmerLoginPage from './pages/farmer/FarmerLoginPage';
import FarmerLayout from './components/farmer/FarmerLayout';
import FarmerProtectedRoute from './components/farmer/FarmerProtectedRoute';
import FarmerDashboardPage from './pages/farmer/FarmerDashboardPage';
import ManageProductsPage from './pages/farmer/ManageProductsPage';
import AddProductPage from './pages/farmer/AddProductPage';
import FarmerOrdersPage from './pages/farmer/FarmerOrdersPage';
import FarmerDeliveriesPage from './pages/farmer/FarmerDeliveriesPage';
import FarmerInventoryPage from './pages/farmer/FarmerInventoryPage';
import FarmerEarningsPage from './pages/farmer/FarmerEarningsPage';
import FarmerReviewsPage from './pages/farmer/FarmerReviewsPage';
import FarmerNotificationsPage from './pages/farmer/FarmerNotificationsPage';
import FarmerProfilePageFarmer from './pages/farmer/FarmerProfilePage';
import FarmerVerificationPage from './pages/farmer/FarmerVerificationPage';
import FarmerSupportPage from './pages/farmer/FarmerSupportPage';

// Delivery Partner Module
import DeliveryRegisterPage from './pages/delivery/DeliveryRegisterPage';
import DeliveryLoginPage from './pages/delivery/DeliveryLoginPage';
import DeliveryLayout from './components/delivery/DeliveryLayout';
import DeliveryProtectedRoute from './components/delivery/DeliveryProtectedRoute';
import DeliveryDashboardPage from './pages/delivery/DeliveryDashboardPage';
import DeliveryRequestsPage from './pages/delivery/DeliveryRequestsPage';
import ActiveDeliveriesPage from './pages/delivery/ActiveDeliveriesPage';
import DeliveryHistoryPage from './pages/delivery/DeliveryHistoryPage';
import DeliveryEarningsPage from './pages/delivery/DeliveryEarningsPage';
import DeliveryVerificationPage from './pages/delivery/DeliveryVerificationPage';
import DeliveryNotificationsPage from './pages/delivery/DeliveryNotificationsPage';
import DeliveryProfilePage from './pages/delivery/DeliveryProfilePage';
import DeliverySupportPage from './pages/delivery/DeliverySupportPage';

// Admin Module
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { FarmerManagementPage } from './pages/admin/FarmerManagementPage';
import { CustomerManagementPage } from './pages/admin/CustomerManagementPage';
import { DeliveryPartnerManagementPage } from './pages/admin/DeliveryPartnerManagementPage';
import { ProductManagementPage } from './pages/admin/ProductManagementPage';
import { CategoryManagementPage } from './pages/admin/CategoryManagementPage';
import { OrderManagementPage } from './pages/admin/OrderManagementPage';
import { DeliveryManagementPage } from './pages/admin/DeliveryManagementPage';
import { PaymentManagementPage } from './pages/admin/PaymentManagementPage';
import { ComplaintManagementPage } from './pages/admin/ComplaintManagementPage';
import { ReportsAnalyticsPage } from './pages/admin/ReportsAnalyticsPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';

export default function App() {
  return (
    <CustomerAuthProvider>
      <FarmerAuthProvider>
        <DeliveryAuthProvider>
          <AdminAuthProvider>
            <CartProvider>
              <WishlistProvider>
                <NotificationProvider>
                  <BrowserRouter>
                    <Routes>
                      {/* 1. Public Landing Page */}
                      <Route path="/" element={<LandingPage />} />

                      {/* 2. Unified Authentication Hub (/login, /register, and role-based entry) */}
                      <Route path="/login" element={<AuthPage defaultRole="customer" defaultMode="login" />} />
                      <Route path="/register" element={<AuthPage defaultRole="customer" defaultMode="register" />} />
                      <Route path="/customer/login" element={<AuthPage defaultRole="customer" defaultMode="login" />} />
                      <Route path="/customer/register" element={<AuthPage defaultRole="customer" defaultMode="register" />} />
                      <Route path="/customer/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                      {/* 3. Customer Marketplace & Products (Publicly browsable with Layout) */}
                      <Route element={<CustomerLayout />}>
                        <Route path="/customer/marketplace" element={<MarketplacePage />} />
                        <Route path="/customer/product/:id" element={<ProductDetailsPage />} />
                        <Route path="/customer/farmer/:id" element={<FarmerProfilePage />} />
                        <Route path="/catalogue" element={<CatalogueExplorerPage />} />
                        <Route path="/catalogue/:id" element={<CatalogueExplorerPage />} />
                        <Route path="/customer/catalogue" element={<CatalogueExplorerPage />} />
                        <Route path="/customer/catalogue/:id" element={<CatalogueExplorerPage />} />
                      </Route>

                      {/* 4. Protected Customer Routes */}
                      <Route
                        element={
                          <CustomerProtectedRoute>
                            <CustomerLayout />
                          </CustomerProtectedRoute>
                        }
                      >
                        <Route path="/customer/dashboard" element={<DashboardPage />} />
                        <Route path="/customer/cart" element={<CartPage />} />
                        <Route path="/customer/wishlist" element={<WishlistPage />} />
                        <Route path="/customer/checkout" element={<CheckoutPage />} />
                        <Route path="/customer/order-confirmation/:id" element={<OrderConfirmationPage />} />
                        <Route path="/customer/orders" element={<OrdersPage />} />
                        <Route path="/customer/orders/:id/track" element={<OrderTrackingPage />} />
                        <Route path="/customer/order-tracking/:id" element={<OrderTrackingPage />} />
                        <Route path="/customer/profile" element={<ProfilePage />} />
                        <Route path="/customer/payments" element={<PaymentsPage />} />
                        <Route path="/customer/reviews" element={<ReviewsPage />} />
                        <Route path="/customer/notifications" element={<NotificationsPage />} />
                        <Route path="/customer/support" element={<SupportPage />} />
                      </Route>

                      {/* 5. Farmer Auth Routes */}
                      <Route path="/farmer/register" element={<AuthPage defaultRole="farmer" defaultMode="register" />} />
                      <Route path="/farmer/login" element={<AuthPage defaultRole="farmer" defaultMode="login" />} />

                      {/* Protected Farmer Portal */}
                      <Route
                        path="/farmer"
                        element={
                          <FarmerProtectedRoute>
                            <FarmerLayout />
                          </FarmerProtectedRoute>
                        }
                      >
                        <Route index element={<Navigate to="/farmer/dashboard" replace />} />
                        <Route path="dashboard" element={<FarmerDashboardPage />} />
                        <Route path="products" element={<ManageProductsPage />} />
                        <Route path="products/add" element={<AddProductPage />} />
                        <Route path="orders" element={<FarmerOrdersPage />} />
                        <Route path="deliveries" element={<FarmerDeliveriesPage />} />
                        <Route path="inventory" element={<FarmerInventoryPage />} />
                        <Route path="earnings" element={<FarmerEarningsPage />} />
                        <Route path="reviews" element={<FarmerReviewsPage />} />
                        <Route path="notifications" element={<FarmerNotificationsPage />} />
                        <Route path="profile" element={<FarmerProfilePageFarmer />} />
                        <Route path="verification" element={<FarmerVerificationPage />} />
                        <Route path="support" element={<FarmerSupportPage />} />
                      </Route>

                      {/* 6. Delivery Partner Auth Routes */}
                      <Route path="/delivery/register" element={<AuthPage defaultRole="delivery" defaultMode="register" />} />
                      <Route path="/delivery/login" element={<AuthPage defaultRole="delivery" defaultMode="login" />} />

                      {/* 7. Protected Delivery Partner Portal */}
                      <Route
                        path="/delivery"
                        element={
                          <DeliveryProtectedRoute>
                            <DeliveryLayout />
                          </DeliveryProtectedRoute>
                        }
                      >
                        <Route index element={<Navigate to="/delivery/dashboard" replace />} />
                        <Route path="dashboard" element={<DeliveryDashboardPage />} />
                        <Route path="requests" element={<DeliveryRequestsPage />} />
                        <Route path="active" element={<ActiveDeliveriesPage />} />
                        <Route path="history" element={<DeliveryHistoryPage />} />
                        <Route path="earnings" element={<DeliveryEarningsPage />} />
                        <Route path="verification" element={<DeliveryVerificationPage />} />
                        <Route path="notifications" element={<DeliveryNotificationsPage />} />
                        <Route path="profile" element={<DeliveryProfilePage />} />
                        <Route path="support" element={<DeliverySupportPage />} />
                      </Route>

                      {/* 8. Admin Auth Routes */}
                      <Route path="/admin/login" element={<AuthPage defaultRole="admin" defaultMode="login" />} />

                      {/* 9. Protected Admin Console */}
                      <Route
                        path="/admin"
                        element={
                          <AdminProtectedRoute>
                            <AdminLayout />
                          </AdminProtectedRoute>
                        }
                      >
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboardPage />} />
                        <Route path="farmers" element={<FarmerManagementPage />} />
                        <Route path="customers" element={<CustomerManagementPage />} />
                        <Route path="delivery-partners" element={<DeliveryPartnerManagementPage />} />
                        <Route path="products" element={<ProductManagementPage />} />
                        <Route path="categories" element={<CategoryManagementPage />} />
                        <Route path="orders" element={<OrderManagementPage />} />
                        <Route path="deliveries" element={<DeliveryManagementPage />} />
                        <Route path="payments" element={<PaymentManagementPage />} />
                        <Route path="complaints" element={<ComplaintManagementPage />} />
                        <Route path="reports" element={<ReportsAnalyticsPage />} />
                        <Route path="notifications" element={<AdminNotificationsPage />} />
                        <Route path="settings" element={<AdminSettingsPage />} />
                        <Route path="audit-logs" element={<AuditLogsPage />} />
                      </Route>

                      {/* Catch-all redirect */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </BrowserRouter>
                </NotificationProvider>
              </WishlistProvider>
            </CartProvider>
          </AdminAuthProvider>
        </DeliveryAuthProvider>
      </FarmerAuthProvider>
    </CustomerAuthProvider>
  );
}
