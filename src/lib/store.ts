import { useState, useEffect, useCallback } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: string;
  description?: string;
  shippingOverride?: boolean;
  allowImageUpload?: boolean;
  variants?: {
    label: string;
    price: number;
  }[];
  selectedVariant?: {
    label: string;
    price: number;
  };
  customFields?: {
    type: 'text' | 'date' | 'image';
    label: string;
    required?: boolean;
    maxPhotos?: number;
  }[];
}

export interface CartItem {
  id: string; // Unique ID for this specific cart item (since same product can have different customizations)
  product: Product;
  quantity: number;
  customizations?: Record<string, any>;
}

const CART_KEY = 'updategifts_cart';

function getStoredCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    const items: CartItem[] = stored ? JSON.parse(stored) : [];
    // Ensure every item has a unique ID (migration for old cart items)
    return items.map(item => ({
      ...item,
      id: item.id || `${item.product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

// Simple event-based cart sync
const listeners = new Set<() => void>();
function notifyCartChange() {
  listeners.forEach(fn => fn());
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(getStoredCart);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('updategifts_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [shippingLocation, setShippingLocation] = useState<'Tamilnadu' | 'Other'>(() => {
    return (localStorage.getItem('updategifts_location') as 'Tamilnadu' | 'Other') || 'Tamilnadu';
  });

  useEffect(() => {
    localStorage.setItem('updategifts_location', shippingLocation);
  }, [shippingLocation]);

  useEffect(() => {
    const handler = () => setItems(getStoredCart());
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  const addToCart = useCallback((product: Product, qty = 1, customizations?: Record<string, any>) => {
    const cart = getStoredCart();
    const customKey = customizations ? JSON.stringify(customizations) : '';
    const existing = cart.find(i => i.product.id === product.id && JSON.stringify(i.customizations || {}) === customKey);
    
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ 
        id: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        product, 
        quantity: qty,
        customizations 
      });
    }
    saveCart(cart);
    setItems(cart);
    notifyCartChange();
  }, []);

  const removeFromCart = useCallback((id: string) => {
    const cart = getStoredCart().filter(i => i.id !== id);
    saveCart(cart);
    setItems(cart);
    notifyCartChange();
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const cart = getStoredCart();
    const item = cart.find(i => i.id === id);
    if (item) {
      item.quantity = Math.max(1, quantity);
      saveCart(cart);
      setItems(cart);
      notifyCartChange();
    }
  }, []);

  const clearCart = useCallback(() => {
    saveCart([]);
    setItems([]);
    notifyCartChange();
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const hasOverride = items.some(i => i.product.shippingOverride);
  
  let shippingCost = 0;
  if (hasOverride) {
    shippingCost = shippingLocation === 'Tamilnadu' ? 100 : 200;
  } else if (totalPrice < 500) {
    shippingCost = shippingLocation === 'Tamilnadu' ? 80 : 180;
  } else {
    shippingCost = shippingLocation === 'Tamilnadu' ? 0 : 100;
  }

  const login = useCallback((userData: any, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('updategifts_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('updategifts_user');
    setUser(null);
  }, []);

  return { 
    items, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    totalItems, 
    totalPrice,
    shippingLocation,
    setShippingLocation,
    shippingCost,
    user,
    login,
    logout
  };
}
