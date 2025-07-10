'use client';

import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { useNotificationStore } from '@/components/ui/notificationStore';
import Notification from '@/components/ui/Notification';

function showToast(message: string) {
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '32px';
    toast.style.right = '32px';
    toast.style.background = '#323232';
    toast.style.color = '#fff';
    toast.style.padding = '16px 24px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.style.fontSize = '1rem';
    toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

export default function PusherNotify() {
    const notificationsStore = useNotificationStore();
    useEffect(() => {
        // Initialize Pusher notifications
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
        });

        // Subscribe to notification channels
        const channel = pusher.subscribe('orders');
        const adminChannel = pusher.subscribe('admin');

        channel.bind('new-order', (data: any) => {
            notificationsStore.add(
                <Notification
                    type="order"
                    title="طلب جديد"
                    message={`رقم الطلب: ${data.orderId} من ${data.customer} | المبلغ: ${data.total?.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ر.س`}
                    onClose={() => notificationsStore.remove()}
                />,
                { persistent: true }
            );
            window.dispatchEvent(new Event('order-data-refresh'));
        });

        adminChannel.bind('new-order', (data: any) => {
            let type = 'newsletter';
            let title = 'اشعار جديد';
            let message = data.message || '';
            if (data.type === 'contact') {
                type = 'contact';
                title = 'رسالة جديدة';
            } else if (data.type === 'news') {
                type = 'newsletter';
                title = 'اشتراك جديد بالنشرة';
            }
            const id = Date.now() + Math.random();
            notificationsStore.add(
                <Notification
                    type={type as any}
                    title={title}
                    message={message}
                    onClose={() => notificationsStore.remove(id)}
                />, { persistent: true, id }
            );
            setTimeout(() => notificationsStore.remove(id), 5000);
        });

        channel.bind('order-updated', (data: any) => {
            showToast(`تم تحديث الطلب: ${data.orderId}`);
        });

        return () => {
            pusher.unsubscribe('orders');
            pusher.unsubscribe('admin');
            pusher.disconnect();
        };
    }, [notificationsStore]);

    return null; // This component doesn't render anything
} 