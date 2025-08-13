import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

function mask(value?: string | null, visible: number = 4): string | null {
  if (!value) return null;
  const len = value.length;
  if (len <= visible) return '*'.repeat(Math.max(0, len - 1)) + value.slice(-1);
  return `${'*'.repeat(len - visible)}${value.slice(-visible)}`;
}

export async function GET(_req: NextRequest) {
  try {
    const useDb = process.env.USE_DB_CLOUDINARY === 'true';

    let cloudName: string | undefined;
    let apiKey: string | undefined;
    let apiSecret: string | undefined;
    let source: 'db' | 'env' = 'env';

    if (useDb) {
      try {
        const company = await db.company.findFirst();
        cloudName = company?.cloudinaryCloudName || undefined;
        apiKey = company?.cloudinaryApiKey || undefined;
        apiSecret = company?.cloudinaryApiSecret || undefined;
        source = 'db';
      } catch {
        // Fallback to env if DB read fails
        cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        apiKey = process.env.CLOUDINARY_API_KEY;
        apiSecret = process.env.CLOUDINARY_API_SECRET;
        source = 'env';
      }
    } else {
      cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      apiKey = process.env.CLOUDINARY_API_KEY;
      apiSecret = process.env.CLOUDINARY_API_SECRET;
      source = 'env';
    }

    const payload = {
      cloudName: cloudName || null,
      apiKeyMasked: mask(apiKey),
      apiSecretMasked: mask(apiSecret),
      hasApiKey: Boolean(apiKey && apiKey.trim().length > 0),
      hasApiSecret: Boolean(apiSecret && apiSecret.trim().length > 0),
      configured: Boolean(cloudName && apiKey && apiSecret),
      source,
      // Never return raw secrets
    };

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: 'FAILED_TO_READ_CLOUDINARY_CONFIG' },
      { status: 500 }
    );
  }
}


