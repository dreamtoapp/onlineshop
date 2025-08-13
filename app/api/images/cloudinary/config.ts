import cloudinary from 'cloudinary';
import db from '@/lib/prisma';

// Feature-flagged initializer that reads credentials from DB (Company) with env fallback
// Flag: USE_DB_CLOUDINARY === 'true'
export const initCloudinary = async (): Promise<{ error?: string }> => {
  const useDb = process.env.USE_DB_CLOUDINARY === 'true';

  let cloudName: string | undefined;
  let apiKey: string | undefined;
  let apiSecret: string | undefined;

  if (useDb) {
    try {
      const company = await db.company.findFirst();
      cloudName = company?.cloudinaryCloudName ?? process.env.CLOUDINARY_CLOUD_NAME;
      apiKey = company?.cloudinaryApiKey ?? process.env.CLOUDINARY_API_KEY;
      apiSecret = company?.cloudinaryApiSecret ?? process.env.CLOUDINARY_API_SECRET;

      if (!company?.cloudinaryCloudName || !company?.cloudinaryApiKey || !company?.cloudinaryApiSecret) {
        console.warn('[cloudinary] Using env fallback; missing DB credentials while USE_DB_CLOUDINARY=true');
      }
    } catch (error) {
      console.warn('[cloudinary] Failed to read DB settings; using env fallback');
      cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      apiKey = process.env.CLOUDINARY_API_KEY;
      apiSecret = process.env.CLOUDINARY_API_SECRET;
    }
  } else {
    cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    apiKey = process.env.CLOUDINARY_API_KEY;
    apiSecret = process.env.CLOUDINARY_API_SECRET;
  }

  if (!cloudName) {
    return { error: 'MISSING_CLOUD_CONFIG' };
  }

  cloudinary.v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return {};
};
