// 'use client'; // REMOVE THIS LINE to make the component a server component

import Link from '@/components/link';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import NewsletterClientWrapper from './NewsletterClientWrapper';
import { Icon } from '@/components/icons/Icon';
import CustomSvgIcon from './CustomSvgIcon';
import AppVersion from '../AppVersion';

interface FooterProps {
  aboutus?: string;
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  productCount?: number | string;
  clientCount?: number | string;
  userId?: string;
}

// Company Information Component (65 lines)
function CompanyInfo({ aboutus, companyName, productCount, clientCount }: { aboutus?: string; companyName?: string; productCount?: number | string; clientCount?: number | string }) {
  // console.log(productCount, clientCount); // Commented out to prevent unnecessary output
  return (
    <div className="space-y-6">
      {/* Logo and Company Name */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
          <Icon name="Building2" className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{companyName || 'Dream To App'}</h2>
          <p className="text-sm text-foreground font-medium">شركة رائدة في التجارة الإلكترونية</p>
        </div>
      </div>

      {/* Company Description */}
      <p className="text-muted-foreground leading-relaxed">
        {aboutus || 'نحن شركة متخصصة في تقديم أفضل المنتجات والخدمات لعملائنا الكرام، مع التزامنا بأعلى معايير الجودة والتميز في خدمة العملاء.'}
      </p>

      {/* Trust Badges */}
      <div className="flex flex-wrap gap-2">

        <Badge variant="secondary" className="bg-primary/10 text-foreground border-primary/20">
          <Icon name="Award" className="h-3 w-3 ml-1" />
          جودة مضمونة
        </Badge>
        <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
          <Icon name="Truck" className="h-3 w-3 ml-1" />
          توصيل سريع
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{productCount ?? '...'}</div>
          <div className="text-xs text-muted-foreground">منتج</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">{clientCount ?? '...'}</div>
          <div className="text-xs text-muted-foreground">عميل راضي</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">24/7</div>
          <div className="text-xs text-muted-foreground">دعم فني</div>
        </div>
      </div>
    </div>
  );
}

// Services Section Component (45 lines)
function ServicesSection({ userId }: { userId?: string }) {
  const services = [
    { name: 'المتجر الإلكتروني', href: '/', iconName: 'ShoppingBag' },
    { name: 'من نحن', href: '/about', iconName: 'Users' },
    { name: 'تواصل معنا', href: '/contact', iconName: 'Phone' },
    { name: 'المفضلة', href: userId ? `/user/wishlist/${userId}` : '/auth/login?redirect=/user/wishlist', iconName: 'Heart' },
    { name: 'التقييمات', href: '/user/ratings', iconName: 'Star' },
    { name: 'الطلبات', href: '/user/purchase-history', iconName: 'Package' },
  ];
  const customerService = [
    { name: 'الدعم الفني', href: '/contact', iconName: 'Headset' },
    { name: 'شروط الاستخدام وسياسة الإرجاع', href: '/privacy', iconName: 'CheckCircle2' },
  ];
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Globe" className="h-5 w-5 text-foreground" />
          خدماتنا
        </h3>
        <ul className="space-y-3">
          {services.map((service) => (
            <li key={service.name}>
              <Link
                href={service.href}
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Icon name={service.iconName} className="h-4 w-4 text-foreground group-hover:text-foreground/80 transition-colors" />
                <span className="text-sm">{service.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Headphones" className="h-5 w-5 text-accent" />
          خدمة العملاء
        </h3>
        <ul className="space-y-3">
          {customerService.map((service) => (
            <li key={service.name}>
              <Link
                href={service.href}
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Icon name={service.iconName} className="h-4 w-4 text-accent group-hover:text-accent/80 transition-colors" />
                <span className="text-sm">{service.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Enhanced Contact Component (50 lines)
function EnhancedContact({
  email,
  phone,
  address,
  facebook,
  instagram,
  twitter,
  linkedin
}: {
  email?: string;
  phone?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="MapPin" className="h-5 w-5 text-secondary" />
        تواصل معنا
      </h3>

      <div className="space-y-4">
        {email && (
          <div className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <CustomSvgIcon name="mail" className="h-4 w-4 text-white" />
            </div>
            <a href={`mailto:${email}`} className="text-sm text-gray-300 hover:text-foreground transition-colors">
              {email}
            </a>
          </div>
        )}

        {phone && (
          <div className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <CustomSvgIcon name="phone" className="h-4 w-4 text-white" />
            </div>
            <a href={`tel:${phone}`} className="text-sm text-gray-300 hover:text-foreground transition-colors">
              {phone}
            </a>
          </div>
        )}

        {address && (
          <div className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <CustomSvgIcon name="map-pin" className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-gray-300">
              {address}
            </span>
          </div>
        )}

        {/* Social Media Links */}
        {(facebook || instagram || twitter || linkedin) && (
          <div className="pt-4 border-t border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3">تابعنا على</h4>
            <div className="flex gap-3">
              {facebook && (
                <Link
                  href={facebook}
                  aria-label="فيسبوك"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors"
                >
                  <CustomSvgIcon name="facebook" className="h-4 w-4 text-white" />
                </Link>
              )}
              {instagram && (
                <Link
                  href={instagram}
                  aria-label="انستغرام"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors"
                >
                  <CustomSvgIcon name="instagram" className="h-4 w-4 text-white" />
                </Link>
              )}
              {twitter && (
                <Link
                  href={twitter}
                  aria-label="تويتر"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors"
                >
                  <CustomSvgIcon name="twitter" className="h-4 w-4 text-white" />
                </Link>
              )}
              {linkedin && (
                <Link
                  href={linkedin}
                  aria-label="لينكدإن"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors"
                >
                  <CustomSvgIcon name="linkedin" className="h-4 w-4 text-white" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Footer Component (60 lines)
const Footer = ({
  aboutus,
  email,
  phone,
  address,
  facebook,
  instagram,
  twitter,
  linkedin,
  companyName,
  productCount,
  clientCount,
  userId
}: FooterProps) => {
  return (
    <footer className="bg-background border-t border-gray-700 text-foreground pb-24">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Company Info - Takes up more space */}
          <div className="lg:col-span-4">
            <CompanyInfo aboutus={aboutus} companyName={companyName} productCount={productCount} clientCount={clientCount} />
          </div>

          {/* Services - Takes up more space */}
          <div className="lg:col-span-5">
            <ServicesSection userId={userId} />
          </div>

          {/* Contact & Newsletter */}
          <div className="lg:col-span-3 space-y-8">
            <EnhancedContact
              email={email}
              phone={phone}
              address={address}
              facebook={facebook}
              instagram={instagram}
              twitter={twitter}
              linkedin={linkedin}
            />
            <NewsletterClientWrapper />
          </div>
        </div>
      </div>

      <Separator className="mx-4 sm:mx-6 lg:mx-8 border-gray-700" />

      {/* Bottom Footer - Developer Area */}
      <div className="bg-muted/30 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AppVersion />
            <div className="text-sm text-gray-400">
              © 2024 Dream To App. جميع الحقوق محفوظة.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
