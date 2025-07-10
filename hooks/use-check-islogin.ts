// lib/auth/client.ts
'use client';

import { useEffect, useState } from 'react';

import { checkIsLogin } from '@/lib/check-is-login';
import { User } from '@/types/databaseTypes';
import { useCartStore } from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/cartStore';

// Custom type definitions

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

export const useCheckIsLogin = () => {
  const [session, setSession] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const { mergeWithServerCart, fetchServerCart, lastSyncTime } = useCartStore();
  const prevStatusRef = useState<AuthStatus>('loading');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setStatus('loading');
        const user = await checkIsLogin();
        if (user) {
          setSession(user);
          setStatus('authenticated');
        } else {
          setSession(null);
          setStatus('unauthenticated');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch session');
        setStatus('unauthenticated');
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    // On login, merge local cart with server cart (only on transition)
    if (prevStatusRef[0] === 'unauthenticated' && status === 'authenticated') {
      mergeWithServerCart();
    }
    prevStatusRef[0] = status;
  }, [status, mergeWithServerCart]);

  useEffect(() => {
    // Always fetch latest server cart for authenticated users after login/refresh
    // Only fetch if not recently synced (avoid redundant fetches)
    if (status === 'authenticated') {
      const now = Date.now();
      // 5s threshold to avoid excessive fetches on fast navigation
      if (!lastSyncTime || now - lastSyncTime > 5000) {
        fetchServerCart();
      }
    }
  }, [status, fetchServerCart, lastSyncTime]);

  return {
    session,
    status,
    error,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
};
