import { NextRequest, NextResponse } from 'next/server';
import { logErrorToDatabase } from '@/helpers/errorLogger';

// 🧪 Test endpoint for error email notifications
export async function POST(_request: NextRequest) {
  try {
    // Create a test error
    const testError = new Error('Test error for email notification system - This is just a test!');
    
    // Log the error (this will automatically send an email)
    const errorId = await logErrorToDatabase(testError, {
      url: 'http://localhost:3000/api/test/error-email',
      additionalInfo: 'Test error generated from API endpoint'
    });

    return NextResponse.json({
      success: true,
      message: 'Test error logged and email sent',
      errorId
    });

  } catch (error) {
    console.error('Failed to test error email:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to test error email'
    }, { status: 500 });
  }
} 