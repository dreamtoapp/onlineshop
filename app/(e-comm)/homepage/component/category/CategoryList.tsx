import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getCategories } from '../../actions/getCategories';

export default async function CategoryList() {
    const categories = await getCategories();

    return (
        <Card className="mx-auto w-full bg-transparent shadow-sm">
            <CardContent className="p-4">
                <div className="flex items-center justify-between pb-3">
                    <div className="space-y-0.5">
                        <h2 className="text-2xl font-bold text-foreground">تسوق حسب الفئة</h2>
                        <p className="text-sm text-muted-foreground">استكشف مجموعتنا المتنوعة من المنتجات حسب الفئة</p>
                    </div>
                    <Link href="/categories" className="flex items-center text-sm font-medium text-primary hover:underline">
                        عرض الكل
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </Link>
                </div>
                <ScrollArea className="w-full py-3">
                    <div className="flex gap-5 pb-3">
                        {categories.map((category) => (
                            <Link key={category.id} href={`/categories/${category.slug}`} className="group cursor-pointer overflow-hidden rounded-xl">
                                <div className="relative h-44 w-72 overflow-hidden rounded-xl shadow-md transition-all duration-300">
                                    {category.imageUrl ? (
                                        <Image
                                            src={category.imageUrl}
                                            alt={category.name}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 288px"
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            priority={true}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                                    )}
                                    <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                                        <h3 className="text-xl font-bold tracking-tight">{category.name}</h3>
                                        <div className="mt-1 flex items-center justify-between">
                                            <Badge className={`${category.productCount > 0 ? 'bg-primary' : 'bg-destructive'} text-white`}>
                                                {category.productCount > 0 ? `${category.productCount} منتجات` : 'لا توجد منتجات'}
                                            </Badge>
                                            <span className="flex items-center text-sm font-medium text-white/90 transition-transform duration-300 group-hover:translate-x-1">
                                                تصفح
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                                    <path d="M5 12h14"></path>
                                                    <path d="m12 5 7 7-7 7"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="h-2 [&>div]:bg-primary/30" />
                </ScrollArea>
            </CardContent>
        </Card>
    );
} 