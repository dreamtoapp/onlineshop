"use client";
import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/push-sw.js')
                .then(reg => {
                    console.log('Service Worker registered:', reg);
                })
                .catch(err => {
                    console.error('Service Worker registration failed:', err);
                });
        }
    }, []);
    return null;
} 