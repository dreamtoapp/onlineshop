import { NextResponse } from 'next/server';
import { getWhatsAppConfig } from '@/lib/whatsapp/config';

export async function GET() {
  try {
    // DB-backed WhatsApp config
    const { accessToken, businessAccountId, apiVersion } = await getWhatsAppConfig();

    if (!accessToken || !businessAccountId) {
      return NextResponse.json({
        success: false,
        message: 'Missing environment variables'
      }, { status: 400 });
    }

    const endpoint = `https://graph.facebook.com/${apiVersion}/${businessAccountId}/message_templates?fields=name,components,language,status`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: data.error?.message || 'Failed to fetch templates',
        details: data
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Get template details error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 