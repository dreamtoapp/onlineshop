// lib/auth/client.ts
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { checkIsLogin } from '@/lib/check-is-login';
import { User } from '@/types/databaseTypes';
// import { useCartStore } from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/cartStore';

// Custom type definitions

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

export const useCheckIsLogin = () => {
  const [session, setSession] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  // Use NextAuth session directly - simpler and more reliable
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        console.log('🔐 Fetching session from checkIsLogin...');
        const user = await checkIsLogin();
        console.log('🔐 checkIsLogin result:', !!user, user?.id);

        if (user) {
          setSession(user);
          setStatus('authenticated');
          console.log('🔐 Set status to authenticated');
        } else {
          setSession(null);
          setStatus('unauthenticated');
          console.log('🔐 Set status to unauthenticated');
        }
      } catch (err) {
        console.error('🔐 Error fetching session:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch session');
        setStatus('unauthenticated');
      }
    };

    // Debug logging
    console.log('🔐 useCheckIsLogin - NextAuth Status:', nextAuthStatus, 'NextAuth Session:', !!nextAuthSession?.user);

    // Simplified logic - use NextAuth status directly
    if (nextAuthStatus === 'authenticated' && nextAuthSession?.user) {
      console.log('🔐 NextAuth authenticated, fetching session...');
      fetchSession();
    } else if (nextAuthStatus === 'unauthenticated') {
      console.log('🔐 NextAuth unauthenticated, setting status...');
      setSession(null);
      setStatus('unauthenticated');
    } else if (nextAuthStatus === 'loading') {
      console.log('🔐 NextAuth loading, setting status...');
      setStatus('loading');
    }

    // Add fallback: if NextAuth is authenticated but we haven't fetched session yet
    if (nextAuthStatus === 'authenticated' && nextAuthSession?.user && status === 'loading') {
      console.log('🔐 Fallback: NextAuth authenticated but status still loading, fetching session...');
      fetchSession();
    }

  }, [nextAuthSession, nextAuthStatus, status]);

  return {
    session,
    status,
    error,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
};
