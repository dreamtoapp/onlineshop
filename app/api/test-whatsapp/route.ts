import { NextRequest, NextResponse } from 'next/server';
import { sendOTPTemplate } from '@/lib/whatsapp/send-otp-template';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, otp } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Test sending OTP via template
    const code = otp || Math.floor(100000 + Math.random() * 900000).toString();
    const result = await sendOTPTemplate(phoneNumber, code);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Template OTP sent successfully',
        data: result.data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Test WhatsApp error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'WhatsApp Test API is running',
    instructions: 'Send POST request with { phoneNumber: "+1234567890", message: "Hello" }'
  });
} 