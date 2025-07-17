import Image from 'next/image';

import Link from '@/components/link';

export default function Logo({ logo, logoAlt }: { logo: string; logoAlt: string }) {
  return (
    <Link href='/' aria-label='الصفحة الرئيسية' className="shrink-0">
      <div
        className="relative flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center overflow-hidden rounded-lg transition-opacity hover:opacity-90"
        tabIndex={0}
        role="img"
        aria-label={logoAlt || 'شعار المتجر'}
      >
        <Image
          src={logo || '/assets/logo.png'}
          alt={logoAlt || 'شعار المتجر'}
          fill
          priority
          className="rounded-lg object-contain"
          sizes="(max-width: 640px) 32px, (max-width: 768px) 40px, 48px"
        />
      </div>
    </Link>
  );
}
