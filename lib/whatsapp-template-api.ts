'use server';

export interface TemplateMessageResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

// Send OTP using WhatsApp template (approved by Meta)
export async function sendOTPTemplate(
  phoneNumber: string, 
  otp: string
): Promise<TemplateMessageResponse> {
  try {
    const accessToken = process.env.WHATSAPP_PERMANENT_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
      return { success: false, error: 'Server configuration error' };
    }

    const endpoint = `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`;
    const requestBody = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'template',
      template: {
        name: 'otp_verification', // Your approved template name
        language: {
          code: 'ar' // Arabic language code
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: otp
              }
            ]
          }
        ]
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error?.message || 'Failed to send template' };
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
}

// Fallback: Send regular text message (only works if user messaged you first)
export async function sendOTPTextMessage(
  phoneNumber: string, 
  otp: string
): Promise<TemplateMessageResponse> {
  try {
    const accessToken = process.env.WHATSAPP_PERMANENT_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
      return { success: false, error: 'Server configuration error' };
    }

    const message = `🔐 رمز التحقق الخاص بك

رمز التحقق: *${otp}*

⏰ هذا الرمز صالح لمدة 10 دقائق فقط

⚠️ لا تشارك هذا الرمز مع أي شخص

إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.

شكراً لك
متجرنا الإلكتروني`;

    const endpoint = `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`;
    const requestBody = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: { body: message },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error?.message || 'Failed to send message' };
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
} 