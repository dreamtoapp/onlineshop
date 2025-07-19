'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
    useEffect(() => {
        const registerServiceWorker = async () => {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                try {
                    console.log('🔧 Registering service worker...');

                    const registration = await navigator.serviceWorker.register('/push-sw.js');
                    console.log('✅ Service Worker registered successfully:', registration);

                    // Check if service worker is active
                    if (registration.active) {
                        console.log('✅ Service Worker is active');
                    } else {
                        console.log('⏳ Service Worker is not yet active');
                    }

                    // Check if we need to request notification permission
                    if (Notification.permission === 'default') {
                        console.log('📋 Requesting notification permission...');
                        const permission = await Notification.requestPermission();
                        console.log('📋 Permission result:', permission);

                        if (permission === 'granted') {
                            console.log('✅ Notification permission granted');
                        } else {
                            console.log('❌ Notification permission denied');
                        }
                    }

                    // Subscribe to push notifications
                    if (Notification.permission === 'granted') {
                        console.log('🔔 Subscribing to push notifications...');

                        const subscription = await registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                        });

                        console.log('✅ Push subscription created:', subscription);

                        // Send subscription to server
                        const response = await fetch('/api/push-subscription', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(subscription)
                        });

                        if (response.ok) {
                            console.log('✅ Push subscription saved to server');
                        } else {
                            console.error('❌ Failed to save push subscription');
                        }
                    }

                } catch (error) {
                    console.error('❌ Service Worker registration failed:', error);
                }
            } else {
                console.log('❌ Service Worker or Push Manager not supported');
            }
        };

        registerServiceWorker();
    }, []);

    return null; // This component doesn't render anything
} 