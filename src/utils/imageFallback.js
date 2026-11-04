// Universal High-Quality Image Fallback Utility for FarmDoor
// Provides category-aware, verified photography fallbacks for any image loading error

export const CATEGORY_FALLBACK_IMAGES = {
  vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
  grains: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
  'grains-and-cereals': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
  'grains-and-pulses': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
  pulses: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
  'pulses-and-lentils': 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
  dairy: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
  'dairy-products': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
  honey: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
  spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
  'organic-products': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  organic: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  seeds: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80',
  'natural-fertilizers': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80',
  'other-farm-products': 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
  'dry-fruits': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
};

export const AVATAR_FALLBACKS = {
  admin: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  farmer: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=400&q=80',
  delivery: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  customer: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  farmCover: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
};

/**
 * Handle image error safely without infinite retry loops
 * @param {Event} e - Image onError event
 * @param {string} [category] - Optional category slug
 */
export function handleImageError(e, category) {
  const target = e.currentTarget || e.target;
  if (!target) return;
  target.onerror = null; // Prevent infinite error handler loops
  const fallback = (category && CATEGORY_FALLBACK_IMAGES[category]) || CATEGORY_FALLBACK_IMAGES.default;
  if (target.src !== fallback) {
    target.src = fallback;
  }
}

/**
 * Handle user avatar error safely
 * @param {Event} e - Image onError event
 * @param {string} [role] - User role ('admin' | 'farmer' | 'delivery' | 'customer')
 */
export function handleAvatarError(e, role) {
  const target = e.currentTarget || e.target;
  if (!target) return;
  target.onerror = null;
  const fallback = (role && AVATAR_FALLBACKS[role]) || AVATAR_FALLBACKS.customer;
  if (target.src !== fallback) {
    target.src = fallback;
  }
}

