import { buildApiEndpoint, getApiHeaders } from '@/lib/whatsapp/config';

export async function sendWhatsAppText(toWa: string, body: string): Promise<void> {
  const url = await buildApiEndpoint('/messages');
  const headers = await getApiHeaders();

  const payload = {
    messaging_product: 'whatsapp',
    to: toWa,
    type: 'text',
    text: {
      preview_url: false,
      body,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`WhatsApp send failed: ${res.status} ${res.statusText} ${text}`);
  }
}



