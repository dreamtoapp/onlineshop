import { Card, CardContent } from '@/components/ui/card';
import { Heart, Search, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from '@/components/link';

export default function EmptyWishlist() {
    return (
        <Card className="border-dashed border-2 border-border/50">
            <CardContent className="py-16 text-center">
                <div className="mx-auto mb-6 p-6 bg-feature-products/10 rounded-full w-fit">
                    <Heart className="w-12 h-12 text-feature-products" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">قائمة المفضلة فارغة</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                    لم تقم بإضافة أي منتجات إلى المفضلة بعد. تصفح متجرنا واكتشف المنتجات الرائعة وأضفها إلى مفضلتك!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="btn-add">
                        <Link href='/'>
                            <Search className="w-4 h-4 mr-2" />
                            تصفح المنتجات
                        </Link>
                    </Button>
                    <Button variant="outline" asChild className="btn-view-outline">
                        <Link href='/categories'>
                            <Grid3X3 className="w-4 h-4 mr-2" />
                            عرض الفئات
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 