'use client';

import Link from '@/components/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BackButton from '@/components/BackButton';
import { Icon } from '@/components/icons/Icon';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-muted/60 flex items-center justify-center p-4">
      <div className="container max-w-4xl">
        {/* Enhanced Back Button */}
        <div className="mb-6">
          <BackButton variant="default" />
        </div>

        {/* Main 404 Card */}
        <Card className="shadow-xl border-l-8 border-l-feature-settings card-hover-effect card-border-glow overflow-hidden">
          <CardHeader className="pb-6 text-center relative">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 h-32 w-32 bg-feature-settings-soft rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 h-24 w-24 bg-feature-analytics-soft rounded-full opacity-20 transform -translate-x-12 translate-y-12"></div>

            <CardTitle className="flex flex-col items-center gap-4 text-3xl relative z-10">
              {/* Enhanced Error Icon */}
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-feature-settings-soft flex items-center justify-center animate-pulse">
                  <Icon name="AlertTriangle" className="h-12 w-12 text-feature-settings icon-enhanced" />
                </div>
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 text-xs font-bold animate-bounce"
                >
                  404
                </Badge>
              </div>

              <div className="space-y-2">
                <h1 className="text-feature-settings font-bold">الصفحة غير موجودة</h1>
                <p className="text-lg text-muted-foreground font-normal">
                  عذراً، لم نتمكن من العثور على الصفحة المطلوبة
                </p>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Error Description */}
            <div className="text-center space-y-4">
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                يبدو أن الرابط الذي تحاول الوصول إليه قد تم نقله أو حذفه أو لا يتوفر حالياً.
                يمكنك المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.
              </p>

              {/* Status Info */}
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className="text-xs">
                  كود الخطأ: 404
                </Badge>
                <Badge variant="outline" className="text-xs">
                  الصفحة غير متاحة
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Primary Actions */}
              <Card className="shadow-md border-l-4 border-l-feature-analytics card-hover-effect">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon name="Home" className="h-5 w-5 text-feature-analytics icon-enhanced" />
                    العودة للرئيسية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href="/">
                    <Button className="btn-professional w-full bg-feature-analytics hover:bg-feature-analytics/90">
                      <Icon name="Home" className="h-4 w-4 ml-2" />
                      الصفحة الرئيسية
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Secondary Actions */}
              <Card className="shadow-md border-l-4 border-l-feature-users card-hover-effect">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon name="Search" className="h-5 w-5 text-feature-users icon-enhanced" />
                    البحث والاستكشاف
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href="/categories">
                    <Button variant="outline" className="btn-professional w-full border-feature-users text-feature-users hover:bg-feature-users-soft">
                      <Icon name="Search" className="h-4 w-4 ml-2" />
                      تصفح المنتجات
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <Card className="shadow-md border-l-4 border-l-feature-commerce card-hover-effect">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Icon name="HelpCircle" className="h-5 w-5 text-feature-commerce icon-enhanced" />
                  روابط مفيدة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Link href="/">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="btn-professional w-full justify-start hover:bg-feature-analytics-soft"
                    >
                      <Icon name="Home" className="h-4 w-4 ml-2" />
                      الرئيسية
                    </Button>
                  </Link>

                  <Link href="/categories">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="btn-professional w-full justify-start hover:bg-feature-products-soft"
                    >
                      <Icon name="Search" className="h-4 w-4 ml-2" />
                      المنتجات
                    </Button>
                  </Link>

                  <Link href="/about">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="btn-professional w-full justify-start hover:bg-feature-users-soft"
                    >
                      <Icon name="HelpCircle" className="h-4 w-4 ml-2" />
                      من نحن
                    </Button>
                  </Link>

                  <Link href="/contact">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="btn-professional w-full justify-start hover:bg-feature-commerce-soft"
                    >
                      <Icon name="AlertTriangle" className="h-4 w-4 ml-2" />
                      اتصل بنا
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Technical Actions */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="btn-professional hover:bg-feature-settings-soft"
              >
                <Icon name="RefreshCw" className="h-4 w-4 ml-2" />
                إعادة تحميل
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
                className="btn-professional hover:bg-feature-analytics-soft"
              >
                <Icon name="ArrowLeft" className="h-4 w-4 ml-2" />
                الصفحة السابقة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Help Text with CTA */}
        <Card className="mt-6 shadow-md border-l-4 border-l-feature-commerce card-hover-effect">
          <CardContent className="py-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                إذا استمرت المشكلة، يرجى التواصل مع فريق الدعم الفني
              </p>

              <div className="flex items-center justify-center gap-3">
                <Link href="/contact">
                  <Button className="btn-add">
                    <Icon name="HelpCircle" className="h-4 w-4 ml-2" />
                    تواصل مع الدعم
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="btn-professional hover:bg-feature-commerce-soft"
                  onClick={() => window.open('mailto:support@ecommerce.com', '_blank')}
                >
                  <Icon name="AlertTriangle" className="h-4 w-4 ml-2" />
                  إرسال إيميل
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  استجابة خلال 24 ساعة
                </Badge>
                <Badge variant="outline" className="text-xs">
                  دعم فني متخصص
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
