import { auth } from '@/auth';
import OtpForm from './component/OtpForm';
import { shouldRequireWhatsappOtp } from '@/helpers/featureFlags';
import Link from 'next/link';

export default async function VerifyPage() {
  const seisson = await auth();

  // Check if OTP is enabled - gate the entire page
  const otpEnabled = await shouldRequireWhatsappOtp();
  if (!otpEnabled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-4">OTP Verification Disabled</h1>
          <p className="text-muted-foreground mb-6">
            WhatsApp OTP verification is currently disabled for this account. You can proceed with normal authentication.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!seisson) {
    return (
      <div className="min-h-screen bg-background">
        <OtpForm phone={""} />
      </div>
    );
  }

  const userData = {
    phone: seisson?.user?.phone,
  };

  return (
    <div className="min-h-screen bg-background">
      <OtpForm phone={userData.phone} />
    </div>
  );
}
