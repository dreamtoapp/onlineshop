import { NextRequest, NextResponse } from 'next/server';
import cloudinary from 'cloudinary';
import { initCloudinary } from '@/app/api/images/cloudinary/config';

function toPercent(usage?: number, limit?: number): number | null {
  if (typeof usage !== 'number' || typeof limit !== 'number' || limit <= 0) return null;
  return Math.min(100, Math.round((usage / limit) * 100));
}

function safeNumber(v: unknown): number | undefined {
  return typeof v === 'number' ? v : undefined;
}

export async function GET(_req: NextRequest) {
  const { error } = await initCloudinary();
  if (error) {
    return NextResponse.json({ error: 'MISSING_CLOUD_CONFIG' }, { status: 500 });
  }

  try {
    const usage = await cloudinary.v2.api.usage();

    const storageUsage = safeNumber((usage as any)?.storage?.usage);
    const storageLimit = safeNumber((usage as any)?.storage?.limit);

    const bandwidthUsage = safeNumber((usage as any)?.bandwidth?.usage);
    const bandwidthLimit = safeNumber((usage as any)?.bandwidth?.limit);

    const transformationsUsage = safeNumber((usage as any)?.transformations?.usage);
    const transformationsLimit = safeNumber((usage as any)?.transformations?.limit);

    return NextResponse.json({
      lastUpdated: (usage as any)?.last_updated || null,
      storage: {
        usage: storageUsage ?? null,
        limit: storageLimit ?? null,
        percent: toPercent(storageUsage, storageLimit),
      },
      bandwidth: {
        usage: bandwidthUsage ?? null,
        limit: bandwidthLimit ?? null,
        percent: toPercent(bandwidthUsage, bandwidthLimit),
      },
      transformations: {
        usage: transformationsUsage ?? null,
        limit: transformationsLimit ?? null,
        percent: toPercent(transformationsUsage, transformationsLimit),
      },
      raw: {
        plan: (usage as any)?.plan || null,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'FAILED_TO_FETCH_USAGE' }, { status: 500 });
  }
}


