'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface AdminNotificationListenerProps {
    showToast?: boolean;
}

export default function AdminNotificationListener({ showToast = true }: AdminNotificationListenerProps) {
    const { data: session } = useSession();

    useEffect(() => {
        console.log('🔍 [DASHBOARD] AdminNotificationListener mounted', {
            userId: session?.user?.id,
            role: session?.user?.role,
            isAdmin: session?.user?.role && ['ADMIN', 'MARKETER'].includes(session.user.role)
        });

        if (!session?.user?.id || !['ADMIN', 'MARKETER'].includes(session.user.role)) {
            console.log('❌ [DASHBOARD] Not an admin user, skipping initialization');
            return;
        }

        let pusher: any = null;
        let channel: any = null;

        const initializePusher = async () => {
            try {
                const { getPusherClient } = await import('@/lib/pusherClient');
                pusher = await getPusherClient();

                // Subscribe to admin-specific channel for dashboard feedback
                channel = pusher.subscribe(`admin-${session.user.id}`);

                // Listen for new orders (dashboard feedback only)
                channel.bind('new-order', (data: any) => {
                    console.log('📊 [DASHBOARD] New order received:', data);

                    if (showToast) {
                        toast.success('طلب جديد', {
                            description: `طلب #${data.orderId} من ${data.customer} - ${data.total?.toFixed(2)} ر.س`,
                            action: {
                                label: 'عرض',
                                onClick: () => window.location.href = '/dashboard/management-orders'
                            },
                            duration: 5000,
                        });
                    }

                    // Optionally refresh dashboard data
                    // window.location.reload();
                });

                // Listen for support alerts
                channel.bind('support-alert', (data: any) => {
                    console.log('📞 [DASHBOARD] Support alert received:', data);

                    if (showToast) {
                        toast.warning('طلب دعم', {
                            description: data.message,
                            action: {
                                label: 'عرض',
                                onClick: () => window.location.href = '/dashboard/management/client-submission'
                            },
                            duration: 5000,
                        });
                    }
                });

                // Connection event handlers
                pusher.connection.bind('connected', () => {
                    console.log('✅ [DASHBOARD] Pusher connected');
                });

                pusher.connection.bind('disconnected', () => {
                    console.log('❌ [DASHBOARD] Pusher disconnected');
                });

                pusher.connection.bind('failed', () => {
                    console.log('❌ [DASHBOARD] Pusher connection failed');
                });

            } catch (error) {
                console.error('❌ [DASHBOARD] Failed to initialize Pusher:', error);
            }
        };

        initializePusher();

        return () => {
            if (channel) {
                channel.unbind('new-order');
                channel.unbind('support-alert');
                pusher?.unsubscribe(`admin-${session.user.id}`);
            }
            if (pusher?.connection) {
                pusher.connection.unbind('connected');
                pusher.connection.unbind('disconnected');
                pusher.connection.unbind('failed');
            }
        };
    }, [session?.user?.id, session?.user?.role, showToast]);

    return null;
} 