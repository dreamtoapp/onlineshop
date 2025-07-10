// 'use client'; // REMOVE THIS LINE to make the component a server component

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import NewsletterClientWrapper from './NewsletterClientWrapper';
import { Icon } from '@/components/icons/Icon';

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
          <p className="text-sm text-primary font-medium">شركة رائدة في التجارة الإلكترونية</p>
        </div>
      </div>

      {/* Company Description */}
      <p className="text-muted-foreground leading-relaxed">
        {aboutus || 'نحن شركة متخصصة في تقديم أفضل المنتجات والخدمات لعملائنا الكرام، مع التزامنا بأعلى معايير الجودة والتميز في خدمة العملاء.'}
      </p>

      {/* Trust Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground border-secondary">
          <Icon name="Shield" className="h-3 w-3 ml-1" />
          آمن ومضمون
        </Badge>
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
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
          <div className="text-2xl font-bold text-primary">{productCount ?? '...'}</div>
          <div className="text-xs text-muted-foreground">منتج</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">{clientCount ?? '...'}</div>
          <div className="text-xs text-muted-foreground">عميل راضي</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">24/7</div>
          <div className="text-xs text-muted-foreground">دعم فني</div>
        </div>
      </div>
    </div>
  );
}

// Services Section Component (45 lines)
function ServicesSection() {
  const services = [
    { name: 'المتجر الإلكتروني', href: '/', iconName: 'ShoppingBag' },
    { name: 'من نحن', href: '/about', iconName: 'Users' },
    { name: 'تواصل معنا', href: '/contact', iconName: 'Phone' },
    { name: 'المفضلة', href: '/user/wishlist', iconName: 'Heart' },
    { name: 'التقييمات', href: '/user/ratings', iconName: 'Star' },
    { name: 'الطلبات', href: '/user/purchase-history', iconName: 'CreditCard' },
  ];

  const customerService = [
    { name: 'الدعم الفني', href: '/support', iconName: 'Headphones' },
    { name: 'شروط الاستخدام', href: '/terms', iconName: 'Shield' },
    { name: 'سياسة الخصوصية', href: '/privacy', iconName: 'CheckCircle' },
    { name: 'سياسة الإرجاع', href: '/returns', iconName: 'Truck' },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Globe" className="h-5 w-5 text-primary" />
          خدماتنا
        </h3>
        <ul className="space-y-3">
          {services.map((service) => (
            <li key={service.name}>
              <Link
                href={service.href}
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Icon name={service.iconName} className="h-4 w-4 text-primary group-hover:text-primary/80 transition-colors" />
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
            <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center">
              <Icon name="Mail" className="h-4 w-4 text-secondary" />
            </div>
            <a href={`mailto:${email}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {email}
            </a>
          </div>
        )}

        {phone && (
          <div className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center">
              <Icon name="Phone" className="h-4 w-4 text-secondary" />
            </div>
            <a href={`tel:${phone}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {phone}
            </a>
          </div>
        )}

        {address && (
          <div className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center">
              <Icon name="MapPin" className="h-4 w-4 text-secondary" />
            </div>
            <span className="text-sm text-muted-foreground">
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
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Icon name="Facebook" className="h-4 w-4 text-primary" />
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Icon name="Instagram" className="h-4 w-4 text-primary" />
                </a>
              )}
              {twitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Icon name="Twitter" className="h-4 w-4 text-primary" />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Icon name="Linkedin" className="h-4 w-4 text-primary" />
                </a>
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
}: FooterProps) => {
  return (
    <footer className="bg-background border-t border-border">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Company Info - Takes up more space */}
          <div className="lg:col-span-4">
            <CompanyInfo aboutus={aboutus} companyName={companyName} productCount={productCount} clientCount={clientCount} />
          </div>

          {/* Services - Takes up more space */}
          <div className="lg:col-span-5">
            <ServicesSection />
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

      <Separator className="mx-4 sm:mx-6 lg:mx-8" />

      {/* Bottom Footer - Developer Area */}
      <div className="bg-muted/30 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              © 2024 Dream To App. جميع الحقوق محفوظة.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
