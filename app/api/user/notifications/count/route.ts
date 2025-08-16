import { NextResponse } from 'next/server';

// 🔔 Get current unread notification count
export async function GET() {
  const startTime = Date.now();

  try {
    console.log('🔐 Notification count API route called at:', new Date().toISOString());

    // Simulate a small delay to test timeout (remove this in production)
    // await new Promise(resolve => setTimeout(resolve, 100));

    const response = {
      success: true,
      count: 0,
      message: 'API route working',
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime
    };

    console.log('✅ Notification count API responding with:', response);

    return NextResponse.json(response);

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('❌ Error in notification count API after', responseTime, 'ms:', error);

    return NextResponse.json({
      success: false,
      error: 'API error',
      timestamp: new Date().toISOString(),
      responseTime
    }, { status: 500 });
  }
} 