// WhatsApp Cloud API Configuration
import db from '@/lib/prisma';

export interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  apiVersion: string;
  businessAccountId: string;
  webhookVerifyToken: string;
  appSecret: string;
  environment: string;
}

// DB-only async getter (single responsibility)
export async function getWhatsAppConfig(): Promise<WhatsAppConfig> {
  const company = await db.company.findFirst();
  if (!company) throw new Error('Company not configured');

  const cfg: WhatsAppConfig = {
    accessToken: company.whatsappPermanentToken || '',
    phoneNumberId: company.whatsappPhoneNumberId || '',
    apiVersion: company.whatsappApiVersion || 'v23.0',
    businessAccountId: company.whatsappBusinessAccountId || '',
    webhookVerifyToken: company.whatsappWebhookVerifyToken || '',
    appSecret: company.whatsappAppSecret || '',
    environment: company.whatsappEnvironment || 'production',
  };

  // Validate required fields and fail fast
  const missing: string[] = [];
  if (!cfg.accessToken) missing.push('accessToken');
  if (!cfg.phoneNumberId) missing.push('phoneNumberId');
  if (missing.length) throw new Error(`WhatsApp configuration error: missing ${missing.join(', ')}`);

  return cfg;
}

export async function buildApiEndpoint(path: string): Promise<string> {
  const config = await getWhatsAppConfig();
  return `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}${path}`;
}

export async function getApiHeaders(): Promise<Record<string, string>> {
  const config = await getWhatsAppConfig();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.accessToken}`,
  };
}