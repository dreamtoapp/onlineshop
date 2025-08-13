
import cloudinary, { type UploadApiOptions, type UploadApiResponse } from 'cloudinary';
import { initCloudinary } from '@/app/api/images/cloudinary/config';


export async function uploadImageToCloudinary(
  filePath: string,
  preset: string,
  folder: string,
): Promise<string> {
  // Ensure Cloudinary SDK is initialized from the centralized config (DB or env)
  const { error } = await initCloudinary();
  if (error) {
    throw new Error('Missing Cloudinary configuration. Please check Cloudinary settings.');
  }

  // Upload options - try with preset first, fallback without preset
  const uploadOptions: UploadApiOptions = {
    folder: folder || 'products',
    resource_type: 'image',
    // Basic transformations during upload
    transformation: [
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  };

  // Add preset if provided, otherwise rely on default settings
  if (preset && preset.trim()) {
    uploadOptions.upload_preset = preset;
  }

  let result: UploadApiResponse;
  try {
    result = await cloudinary.v2.uploader.upload(filePath, uploadOptions);
  } catch (error) {
    // If preset fails, try without preset
    if (preset && error instanceof Error && error.message.includes('preset')) {
      delete uploadOptions.upload_preset;
      result = await cloudinary.v2.uploader.upload(filePath, uploadOptions);
    } else {
      throw error;
    }
  }

  // Generate an optimized URL with auto format, quality, and responsive width
  return cloudinary.v2.url(result.public_id, {
    secure: true,
    transformation: [
      { quality: 'auto' },
      { fetch_format: 'auto' },
      { width: 'auto', crop: 'scale' },
    ],
  });
}
