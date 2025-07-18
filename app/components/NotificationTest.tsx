'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// 🔔 Simple Notification Test Component
export default function NotificationTest() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isMinimized, setIsMinimized] = useState(true); // Start minimized

    // Only run on client after hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    // Test browser push notification
    const testPushNotification = async () => {
        if (!('serviceWorker' in navigator) || !('Notification' in window)) {
            alert('المتصفح لا يدعم الإشعارات');
            return;
        }

        try {
            // Request permission if not granted
            if (Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    alert('تم رفض إذن الإشعارات');
                    return;
                }
            }

            // Show test notification
            new Notification('🔔 إشعار تجريبي', {
                body: 'تم تشغيل الإشعارات بنجاح!',
                icon: '/icons/icon-192x192.png',
                tag: 'test'
            });

        } catch (error) {
            console.error('❌ Push notification test failed:', error);
            alert('خطأ في الإشعار: ' + error);
        }
    };

    // Test real-time notification via API
    const testRealtimeNotification = async () => {
        if (!session?.user?.id) {
            alert('يجب تسجيل الدخول أولاً');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/test/push-notification', {
                method: 'POST'
            });

            const result = await response.json();

            if (result.success) {
                alert('✅ تم إرسال الإشعار التجريبي');
            } else {
                alert('❌ فشل في إرسال الإشعار');
            }
        } catch (error) {
            console.error('❌ API test failed:', error);
            alert('خطأ في الاتصال');
        } finally {
            setLoading(false);
        }
    };

    // Test registration notifications (3 notifications)
    const testRegistrationNotifications = async () => {
        if (!session?.user?.id) {
            alert('يجب تسجيل الدخول أولاً');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/test/registration-notifications', {
                method: 'POST'
            });

            const result = await response.json();

            if (result.success) {
                alert('✅ تم إنشاء 3 إشعارات تسجيل تجريبية');
            } else {
                alert('❌ فشل في إنشاء الإشعارات');
            }
        } catch (error) {
            console.error('❌ Registration test failed:', error);
            alert('خطأ في الاتصال');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isMinimized ? (
                // Minimized - just a small button
                <button
                    onClick={() => setIsMinimized(false)}
                    className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
                    title="اختبار الإشعارات"
                >
                    🔔
                </button>
            ) : (
                // Expanded - full test interface
                <div className="bg-white shadow-lg rounded-lg p-3 border w-64">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-bold text-gray-800">🔔 اختبار الإشعارات</h3>
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-2">
                        {/* Test Browser Push */}
                        <button
                            onClick={testPushNotification}
                            className="w-full px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                        >
                            اختبار إشعار المتصفح
                        </button>

                        {/* Test Real-time */}
                        <button
                            onClick={testRealtimeNotification}
                            disabled={loading || !session?.user?.id}
                            className="w-full px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:bg-gray-400"
                        >
                            {loading ? 'جاري...' : 'اختبار الإشعار الفوري'}
                        </button>

                        {/* Test Registration Notifications */}
                        <button
                            onClick={testRegistrationNotifications}
                            disabled={loading || !session?.user?.id}
                            className="w-full px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 disabled:bg-gray-400"
                        >
                            {loading ? 'جاري...' : 'اختبار إشعارات التسجيل (3)'}
                        </button>

                        {/* Permission Status */}
                        <div className="text-xs text-gray-600">
                            حالة الإذن: {
                                !mounted
                                    ? '⏳ جاري التحقق...'
                                    : 'Notification' in window
                                        ? Notification.permission === 'granted' ? '✅ مسموح'
                                            : Notification.permission === 'denied' ? '❌ مرفوض'
                                                : '⚠️ غير محدد'
                                        : '❌ غير مدعوم'
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 