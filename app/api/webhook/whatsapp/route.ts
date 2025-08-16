import { NextRequest, NextResponse } from 'next/server';
import { getWhatsAppConfig } from '@/lib/whatsapp/config';
import crypto from 'crypto';
import { saveIncomingMessage, recordMessageStatus } from '@/lib/whatsapp/whatsapp-webhook';
import { info } from '@/utils/logger';
import { ERROR_LOGGER } from '@/helpers/errorLogger';
import { sendWhatsAppText } from '@/lib/whatsapp/send';

// DB-backed WhatsApp webhook: verifies subscription (GET) and signatures (POST)

// Verify webhook signature for security
function verifyWebhookSignature(
  body: string,
  signature: string,
  appSecret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', appSecret)
      .update(body, 'utf8')
      .digest('hex');

    return `sha256=${expectedSignature}` === signature;
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // DB config (per-tenant)
    const config = await getWhatsAppConfig();

    if (mode === 'subscribe' && token === config.webhookVerifyToken) {
      console.log('✅ WhatsApp webhook verified successfully');
      return new NextResponse(challenge, { status: 200 });
    }

    console.log('❌ WhatsApp webhook verification failed');
    return new NextResponse('Forbidden', { status: 403 });
  } catch (error) {
    console.error('Webhook verification error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-hub-signature-256');

    // Verify signature using DB app secret
    const config = await getWhatsAppConfig();
    if (signature && !verifyWebhookSignature(body, signature, config.appSecret)) {
      console.error('❌ Invalid webhook signature');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = JSON.parse(body);
    const useDb = process.env.USE_DB_WHATSAPP_WEBHOOK_PROCESSING === 'true';
    info('whatsapp.webhook', { kind: 'request', mode: useDb ? 'db' : 'log-only' });

    // Handle incoming messages and status updates
    if (data.object === 'whatsapp_business_account') {
      const entry = data.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (value?.messages) {
        // Handle incoming messages
        for (const message of value.messages) {
          info('whatsapp.webhook', { kind: 'message', waMessageId: message.id, fromWa: message.from, mode: useDb ? 'db' : 'log-only' });

          if (useDb) {
            try {
              await saveIncomingMessage(value, message);
            } catch (e) {
              ERROR_LOGGER.api(e as Error, '/api/webhook/whatsapp');
            }
          }

          // Optional auto-reply
          if (process.env.AUTO_REPLY_ENABLED === 'true') {
            try {
              const to = message.from;
              await sendWhatsAppText(to, 'مرحبا! تم استلام رسالتك. سنعاودك قريبًا.');
            } catch (e) {
              ERROR_LOGGER.api(e as Error, '/api/webhook/whatsapp');
            }
          }
        }
      }

      if (value?.statuses) {
        // Handle message status updates
        for (const status of value.statuses) {
          info('whatsapp.webhook', { kind: 'status', waMessageId: status.id, status: status.status, mode: useDb ? 'db' : 'log-only' });

          if (useDb) {
            try {
              await recordMessageStatus(status);
            } catch (e) {
              ERROR_LOGGER.api(e as Error, '/api/webhook/whatsapp');
            }
          }
        }
      }
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    try {
      ERROR_LOGGER.api(error as Error, '/api/webhook/whatsapp');
    } catch { }
    return new NextResponse('Error', { status: 500 });
  }
} 