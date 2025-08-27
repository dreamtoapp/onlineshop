import db from '@/lib/prisma';

/**
 * Checks if WhatsApp OTP should be required based on company settings and environment variables
 * @returns Promise<boolean> - true if OTP is required, false if OTP is disabled
 */
export async function shouldRequireWhatsappOtp(): Promise<boolean> {
  try {
    const company = await db.company.findFirst();
    const companyRequiresOtp = company?.requireWhatsappOtp ?? false;
    const envRequiresOtp = process.env.USE_DB_WHATSAPP_OTP !== 'false';

    return companyRequiresOtp && envRequiresOtp;
  } catch (error) {
    console.error('Error checking WhatsApp OTP requirement:', error);
    // Default to false (no OTP) if there's an error
    return false;
  }
}

/**
 * Gets the current company OTP requirement setting
 * @returns Promise<boolean> - true if company requires OTP, false otherwise
 */
export async function getCompanyOtpRequirement(): Promise<boolean> {
  try {
    const company = await db.company.findFirst();
    return company?.requireWhatsappOtp ?? false;
  } catch (error) {
    console.error('Error getting company OTP requirement:', error);
    return false;
  }
}

/**
 * Determines if a new user should be created as verified (isOtp: true)
 * @returns Promise<boolean> - true if user should be verified, false if OTP verification needed
 */
export async function shouldCreateUserAsVerified(): Promise<boolean> {
  try {
    const requireOtp = await shouldRequireWhatsappOtp();
    return !requireOtp; // User is verified if OTP is not required
  } catch (error) {
    console.error('Error determining user verification status:', error);
    return true; // Default to verified if there's an error
  }
}
















