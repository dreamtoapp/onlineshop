'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

// 🔔 Client-side notification counter hook
export function useNotificationCounter(initialCount: number = 0) {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(initialCount);

  // Sync with initial server count
  useEffect(() => {
    setUnreadCount(initialCount);
  }, [initialCount]);

  // Functions to update counter
  const incrementCount = useCallback(() => {
    setUnreadCount(prev => prev + 1);
  }, []);

  const decrementCount = useCallback(() => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const updateCount = useCallback((newCount: number) => {
    setUnreadCount(Math.max(0, newCount));
  }, []);

  const resetCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  // Fetch fresh count from server
  const refreshCount = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      console.log('🔄 Refreshing notification count...');
      const response = await fetch('/api/user/notifications/count', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Increase timeout to 30 seconds for slower connections
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      // Check response status first
      if (!response.ok) {
        console.error('❌ API response not ok:', response.status, response.statusText);
        return;
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('❌ API returned non-JSON response:', contentType);
        console.error('Response text:', await response.text());
        return;
      }

      const data = await response.json();
      console.log('📊 Notification count response:', data);

      if (data.success) {
        setUnreadCount(data.count);
        console.log('✅ Notification count updated:', data.count);
      } else {
        console.error('❌ API returned error:', data.error, data.code);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('⏰ Request timeout while refreshing notification count (30s)');
        // Don't update count on timeout, keep existing value
      } else {
        console.error('❌ Failed to refresh notification count:', error);
      }
    }
  }, [session?.user?.id]);

  return {
    unreadCount,
    incrementCount,
    decrementCount,
    updateCount,
    resetCount,
    refreshCount
  };
} 