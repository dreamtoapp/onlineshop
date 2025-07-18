'use client';

import { useEffect } from 'react';

export default function PusherNotify() {
    useEffect(() => {
        let pusher: any = null;
        let channel: any = null;

        const initializePusher = async () => {
            try {
                // Dynamically import Pusher to avoid SSR issues
                const { getPusherClient } = await import('@/lib/pusherClient');
                pusher = await getPusherClient();

                // Subscribe to orders channel for dashboard updates
                channel = pusher.subscribe('orders');

                // Listen for new orders to refresh dashboard data
                channel.bind('new-order', (_data: any) => {
                    // Removed toast notification to prevent duplicates
                    // Just trigger page refresh or data refetch
                    console.log('📊 Dashboard: New order received, data will refresh');

                    // Optional: You could trigger a data refresh here
                    // refreshDashboardData();
                });

                console.log('✅ Dashboard Pusher notifications initialized');

            } catch (error) {
                console.error('❌ Failed to initialize dashboard Pusher:', error);
            }
        };

        initializePusher();

        // Cleanup
        return () => {
            if (channel) {
                channel.unbind('new-order');
                pusher?.unsubscribe('orders');
            }
        };
    }, []);

    // This component doesn't render anything
    return null;
} 