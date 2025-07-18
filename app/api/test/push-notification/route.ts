import { NextResponse } from 'next/server';

// 🔔 Simple Test Endpoint for Push Notifications
export async function POST() {
  try {
    // Mock notification data
    const testNotification = {
      title: 'إشعار تجريبي',
      body: 'هذا إشعار تجريبي للتأكد من عمل النظام',
      type: 'SYSTEM', // Use valid type instead of TEST
      actionUrl: '/',
      metadata: {
        orderId: 'test-123'
      }
    };

    console.log('🔔 Test push notification triggered:', testNotification);

    return NextResponse.json({ 
      success: true, 
      message: 'Test notification created',
      data: testNotification
    });

  } catch (error) {
    console.error('❌ Error in test push notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create test notification' },
      { status: 500 }
    );
  }
} 