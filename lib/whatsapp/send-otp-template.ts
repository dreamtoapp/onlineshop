'use server';

import { getWhatsAppConfig, buildApiEndpoint, getApiHeaders } from '@/lib/whatsapp/config';
import { convertToInternationalFormat } from '@/lib/whatsapp/whatsapp';

export interface TemplateMessageResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

// Send OTP using WhatsApp approved template
export async function sendOTPTemplate(
  phoneNumber: string,
  otp: string
): Promise<TemplateMessageResponse> {
  try {
    const { accessToken, phoneNumberId } = await getWhatsAppConfig();
    if (!accessToken || !phoneNumberId) return { success: false, error: 'Server configuration error' };

    const internationalPhone = convertToInternationalFormat(phoneNumber);
    const endpoint = await buildApiEndpoint('/messages');
    const headers = await getApiHeaders();

    const requestBody = {
      messaging_product: 'whatsapp',
      to: internationalPhone,
      type: 'template',
      template: {
        name: 'confirm',
        language: { code: 'ar' },
        components: [
          {
            type: 'body',
            parameters: [{ type: 'text', text: otp }],
          },
        ],
      },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    return response.ok
      ? { success: true, data }
      : { success: false, error: data?.error?.message || 'Failed to send template' };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
}





