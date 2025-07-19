"use client";

import { sendGAEvent } from '@next/third-parties/google';

// Custom hook for e-commerce analytics using official Next.js approach
export function useAnalytics() {
  // Track product view
  const trackProductView = (product: {
    id: string;
    name: string;
    category?: string;
    price: number;
  }) => {
    sendGAEvent('event', 'view_item', {
      currency: 'SAR',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category || 'Unknown',
        price: product.price,
        quantity: 1
      }]
    });
  };

  // Track add to cart
  const trackAddToCart = (product: {
    id: string;
    name: string;
    category?: string;
    price: number;
  }, quantity: number = 1) => {
    const value = product.price * quantity;
    sendGAEvent('event', 'add_to_cart', {
      currency: 'SAR',
      value: value,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category || 'Unknown',
        price: product.price,
        quantity: quantity
      }]
    });
  };

  // Track purchase
  const trackPurchase = (transaction: {
    id: string;
    total: number;
    items: Array<{
      productId: string;
      name: string;
      category?: string;
      price: number;
      quantity: number;
    }>;
  }) => {
    sendGAEvent('event', 'purchase', {
      transaction_id: transaction.id,
      value: transaction.total,
      currency: 'SAR',
      items: transaction.items.map(item => ({
        item_id: item.productId,
        item_name: item.name,
        item_category: item.category || 'Unknown',
        price: item.price,
        quantity: item.quantity
      }))
    });
  };

  // Track begin checkout
  const trackBeginCheckout = (cart: {
    items: Array<{
      productId: string;
      name: string;
      category?: string;
      price: number;
      quantity: number;
    }>;
  }) => {
    const value = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    sendGAEvent('event', 'begin_checkout', {
      currency: 'SAR',
      value: value,
      items: cart.items.map(item => ({
        item_id: item.productId,
        item_name: item.name,
        item_category: item.category || 'Unknown',
        price: item.price,
        quantity: item.quantity
      }))
    });
  };

  // Track search
  const trackSearch = (searchTerm: string) => {
    sendGAEvent('event', 'search', {
      search_term: searchTerm
    });
  };

  // Track sign up
  const trackSignUp = (method: string = 'email') => {
    sendGAEvent('event', 'sign_up', {
      method: method
    });
  };

  // Track login
  const trackLogin = (method: string = 'email') => {
    sendGAEvent('event', 'login', {
      method: method
    });
  };

  // Track custom events
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    sendGAEvent('event', eventName, parameters || {});
  };

  return {
    trackProductView,
    trackAddToCart,
    trackPurchase,
    trackBeginCheckout,
    trackSearch,
    trackSignUp,
    trackLogin,
    trackEvent
  };
} 