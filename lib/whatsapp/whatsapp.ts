// Convert KSA numbers to E.164 (+966XXXXXXXXX). Returns original if already valid.
export function convertToInternationalFormat(phoneNumber: string): string {
  const raw = phoneNumber.trim();
  const normalized = raw.replace(/[^\d+]/g, '');
  if (/^\+[1-9]\d{9,14}$/.test(normalized)) return normalized; // already E.164

  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('966') && digits.length === 12) return `+${digits}`; // 966XXXXXXXXX
  if (digits.startsWith('05') && digits.length === 10) return `+966${digits.slice(1)}`; // 05XXXXXXXX → +966XXXXXXXXX
  if (digits.length === 9 && !digits.startsWith('0')) return `+966${digits}`; // XXXXXXXXX → +966XXXXXXXXX

  console.warn(`⚠️ Unknown phone number format: ${phoneNumber}, returning as is`);
  return raw;
}

// Generate WhatsApp URL to prompt user to message business first
export async function generateWhatsAppGuidanceURL(_phoneNumber: string): Promise<string> {
  const businessPhone = process.env.WHATSAPP_BUSINESS_PHONE || '+966XXXXXXXXX';
  const message = encodeURIComponent('Hello, I need to register for OTP verification');
  return `https://wa.me/${businessPhone.replace('+', '')}?text=${message}`;
}


