import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import Link from '@/components/link';
import db from '@/lib/prisma';

export default async function PolicyLinks() {
    // Fetch all published policies
    const [websitePolicy, privacyPolicy, returnPolicy, shippingPolicy] = await Promise.all([
        db.term.findFirst({
            where: { type: 'WEBSITE_POLICY', isActive: true, isPublished: true },
            orderBy: { version: 'desc' }
        }),
        db.term.findFirst({
            where: { type: 'PRIVACY_POLICY', isActive: true, isPublished: true },
            orderBy: { version: 'desc' }
        }),
        db.term.findFirst({
            where: { type: 'RETURN_POLICY', isActive: true, isPublished: true },
            orderBy: { version: 'desc' }
        }),
        db.term.findFirst({
            where: { type: 'SHIPPING_POLICY', isActive: true, isPublished: true },
            orderBy: { version: 'desc' }
        })
    ]);

    const policies = [
        { policy: websitePolicy, href: '/policies/website', title: 'سياسة الموقع', icon: 'Globe', color: 'text-blue-600' },
        { policy: privacyPolicy, href: '/policies/privacy', title: 'سياسة الخصوصية', icon: 'Shield', color: 'text-green-600' },
        { policy: returnPolicy, href: '/policies/return', title: 'سياسة الإرجاع', icon: 'RotateCcw', color: 'text-orange-600' },
        { policy: shippingPolicy, href: '/policies/shipping', title: 'سياسة الشحن', icon: 'Truck', color: 'text-purple-600' }
    ].filter(item => item.policy); // Only show published policies

    if (policies.length === 0) {
        return null; // Don't show section if no policies are published
    }

    return (
        <section className="py-8 border-t">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">الشروط والأحكام</h2>
                <p className="text-muted-foreground">
                    تعرف على سياساتنا وشروط استخدام الموقع
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {policies.map(({ policy, href, title, icon, color }) => (
                    <Card key={href} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <Icon name={icon} className={`h-6 w-6 ${color}`} />
                                <CardTitle className="text-lg">{title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {policy?.content.substring(0, 100)}...
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                    الإصدار {policy?.version}
                                </span>
                                <Link href={href}>
                                    <Button variant="outline" size="sm">
                                        قراءة المزيد
                                        <Icon name="ArrowLeft" className="h-4 w-4 mr-2" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="text-center mt-6">
                <Link href="/policies/website">
                    <Button variant="link" className="text-primary">
                        <Icon name="FileText" className="h-4 w-4 mr-2" />
                        عرض جميع السياسات
                    </Button>
                </Link>
            </div>
        </section>
    );
} 