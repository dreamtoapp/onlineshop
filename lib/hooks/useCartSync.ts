// Background sync hook for optimized cart
'use client';
import { useEffect, useRef } from 'react';
import { useOptimizedCartStore } from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/optimizedCartStore';
import { useCheckIsLogin } from '@/hooks/use-check-islogin';

export const useCartSync = () => {
  const { syncToServer, fetchFromServer, pendingChanges, isSyncing } = useOptimizedCartStore();
  const { isAuthenticated } = useCheckIsLogin();
  const syncTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Debounced sync to server
  useEffect(() => {
    if (!isAuthenticated || Object.keys(pendingChanges).length === 0) return;
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      syncToServer();
    }, 1000);
    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [pendingChanges, isAuthenticated, syncToServer]);

  // Fetch from server on login
  useEffect(() => {
    if (isAuthenticated) fetchFromServer();
  }, [isAuthenticated, fetchFromServer]);

  // Sync on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (Object.keys(pendingChanges).length > 0) syncToServer();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pendingChanges, syncToServer]);

  return { isSyncing };
}; 