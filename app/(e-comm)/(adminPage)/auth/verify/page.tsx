import { auth } from '@/auth';
import BackButton from '@/components/BackButton';
import OtpForm from './component/OtpForm';
import Background from '@/components/ui/Background';

export default async function VerifyPage() {
  const seisson = await auth();

  if (!seisson) {
    return (
      <>
        <Background
          backgroundStyle="commerceIndigo"
          showRadial={true}
          showAccent={true}
          minHeight="min-h-screen"
          centerContent={true}
          padding="p-8"
          patternStyle="blobs"
          patternOpacity={0.8}
        >
          <OtpForm phone={""} />
        </Background>
      </>
    );
  }

  const userData = {
    phone: seisson?.user?.phone,
  };

  return (
    <>
      <BackButton variant="default" />
      <Background
        backgroundStyle="usersBlue"
        showRadial={true}
        showAccent={true}
        minHeight="min-h-screen"
        centerContent={true}
        padding="p-8"
        patternStyle="animate-wavyChaos"
        patternOpacity={1}
        patternAnimation={true}
      >
        <OtpForm phone={userData.phone} />
      </Background>
    </>
  );
}
