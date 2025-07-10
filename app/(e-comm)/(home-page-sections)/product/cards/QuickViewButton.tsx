'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Product } from '@/types/databaseTypes';
import { useMediaQuery } from '@/hooks/use-media-query';
import Link from 'next/link';
import { toast } from 'sonner';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import ImageCarousel from './ImageCarousel';

interface QuickViewButtonProps {
    product: Product;
}

export default function QuickViewButton({ product }: QuickViewButtonProps) {
    const [open, setOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 640px)');
    const formatNum = (n: number) => n.toLocaleString('ar-EG');
    const ratingFormatted = product.rating ? formatNum(Number(product.rating.toFixed(1))) : null;

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-card hover:bg-card/80 shadow-md transition-all duration-200 min-w-[36px] min-h-[36px] md:min-w-[44px] md:min-h-[44px] text-foreground drop-shadow-lg border border-border"
                aria-label={`معاينة سريعة لـ ${product.name}`}
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(true);
                }}
                data-analytics="quick-view-open"
            >
                <Icon name="Eye" size="sm" variant="primary" className="transition-all duration-200 text-primary" />
            </Button>
            {isMobile ? (
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetContent side="bottom" className="h-[90vh] overflow-y-auto p-4 pt-10 [&_svg]:h-5 [&_svg]:w-5 sm:[&_svg]:h-6 sm:[&_svg]:w-6">
                        <SheetHeader className="sr-only">
                            <SheetTitle>{product.name}</SheetTitle>
                        </SheetHeader>

                        <div className="flex flex-col gap-4">
                            <div className="relative w-full overflow-x-auto flex gap-2 snap-x snap-mandatory">
                                {(product.images?.length ? product.images : [product.imageUrl]).filter(Boolean).map((src, idx) => (
                                    <div key={idx} className="relative shrink-0 w-full aspect-[4/5] snap-center">
                                        <Image src={src as string || '/fallback/product-fallback.avif'} alt={product.name} fill sizes="(max-width: 768px) 100vw, 400px" className="object-contain rounded-lg" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center justify-center gap-2 flex-wrap px-2">
                                    <h2 className="text-lg font-bold text-foreground text-center break-words">
                                        {product.name}
                                    </h2>
                                    {product.rating && (
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <Icon name="Star" size="sm" className="fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium">{ratingFormatted}</span>
                                            {product.reviewCount > 0 && (
                                                <Link href={`/product/${product.slug}#reviews`} className="text-xs text-blue-400 hover:underline">({formatNum(product.reviewCount)} تقييم)</Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-lg font-bold text-feature-commerce">
                                    {product.price.toLocaleString()} ر.س
                                </span>
                                {product.compareAtPrice && product.compareAtPrice > product.price && (
                                    <>
                                        <span className="text-sm line-through text-muted-foreground">{product.compareAtPrice.toLocaleString()} ر.س</span>
                                        <Icon name="BadgePercent" size="sm" className="h-4 w-4 text-feature-commerce" />
                                    </>
                                )}
                            </div>
                            <div className="flex items-center justify-center gap-3 text-xs">
                                {product.shippingDays && (
                                    <div className="flex items-center gap-1 text-muted-foreground"><Icon name="Truck" size="xs" /> {product.shippingDays} أيام شحن</div>
                                )}
                                {product.returnPeriodDays && (
                                    <div className="flex items-center gap-1 text-muted-foreground"><Icon name="RotateCw" size="xs" /> إرجاع {product.returnPeriodDays} يوم</div>
                                )}
                                {product.hasQualityGuarantee && (
                                    <div className="flex items-center gap-1 text-muted-foreground"><Icon name="ShieldCheck" size="xs" /> ضمان</div>
                                )}
                            </div>
                            {product.features?.length > 0 && (
                                <div className="px-2">
                                    <h3 className="text-sm font-semibold mb-1">المزايا السريعة:</h3>
                                    <ul className="list-disc pr-4 space-y-0.5 text-xs text-muted-foreground">
                                        {product.features.slice(0, 5).map((f, i) => (
                                            <li key={i}>{f}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="px-2">
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="specs">
                                        <AccordionTrigger className="text-sm">المواصفات التفصيلية</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                                {product.brand && (<div><span className="font-medium text-foreground">العلامة:</span> {product.brand}</div>)}
                                                {product.material && (<div><span className="font-medium text-foreground">المادة:</span> {product.material}</div>)}
                                                {product.color && (<div><span className="font-medium text-foreground">اللون:</span> {product.color}</div>)}
                                                {product.dimensions && (<div><span className="font-medium text-foreground">الأبعاد:</span> {product.dimensions}</div>)}
                                                {product.weight && (<div><span className="font-medium text-foreground">الوزن:</span> {product.weight}</div>)}
                                                {product.careInstructions && (<div className="col-span-2"><span className="font-medium text-foreground">العناية:</span> {product.careInstructions}</div>)}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                            <div className="flex items-center justify-center gap-4 pt-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={async () => {
                                        const shareUrl = `${window.location.origin}/product/${product.slug}`;
                                        if (typeof navigator !== 'undefined' && navigator.share) {
                                            try {
                                                await navigator.share({ title: product.name, text: product.name, url: shareUrl });
                                                toast.success('تمت المشاركة بنجاح');
                                            } catch {
                                                /* مشاركة ملغاة */
                                            }
                                        } else {
                                            if (navigator.clipboard && window.isSecureContext) {
                                                await navigator.clipboard.writeText(shareUrl);
                                                toast.success('تم نسخ رابط المنتج');
                                            } else {
                                                const textArea = document.createElement('textarea');
                                                textArea.value = shareUrl;
                                                textArea.style.position = 'fixed';
                                                textArea.style.opacity = '0';
                                                document.body.appendChild(textArea);
                                                textArea.select();
                                                try { document.execCommand('copy'); toast.success('تم نسخ رابط المنتج'); } catch { }
                                                document.body.removeChild(textArea);
                                            }
                                        }
                                    }}
                                    className="flex items-center gap-1 text-sm"
                                >
                                    <Icon name="Share2" size="sm" /> مشاركة
                                </Button>
                                <Link href={`/product/${product.slug}`} className="text-sm text-blue-500 hover:underline">
                                    التفاصيل الكاملة ↗
                                </Link>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            ) : (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="w-[95vw] max-w-3xl p-6">
                        <DialogHeader className="sr-only">
                            <DialogTitle>{product.name}</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-6 grid-cols-2 max-h-[80vh] overflow-y-auto">
                            <ImageCarousel images={(product.images?.length ? product.images : [product.imageUrl]).filter(Boolean) as string[]} alt={product.name} />
                            <div className="flex flex-col gap-4 pr-1 sm:pr-2">
                                <div className="flex flex-col items-center gap-2 flex-wrap px-2 sm:px-0">
                                    <h2 className="text-xl sm:text-2xl font-bold text-foreground break-words text-center sm:text-start">
                                        {product.name}
                                    </h2>
                                    {product.rating && (
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <Icon name="Star" size="sm" className="fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium">{ratingFormatted}</span>
                                            {product.reviewCount > 0 && (
                                                <Link href={`/product/${product.slug}#reviews`} className="text-xs text-blue-400 hover:underline">({formatNum(product.reviewCount)} تقييم)</Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg sm:text-xl font-bold text-feature-commerce">
                                        {product.price.toLocaleString()} ر.س
                                    </span>
                                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                                        <>
                                            <span className="text-sm line-through text-muted-foreground">{product.compareAtPrice.toLocaleString()} ر.س</span>
                                            <Icon name="BadgePercent" size="sm" className="h-4 w-4 text-feature-commerce" />
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center flex-wrap gap-3 text-xs">
                                    {product.shippingDays && (
                                        <div className="flex items-center gap-1 text-muted-foreground"><Icon name="Truck" size="xs" /> {product.shippingDays} أيام شحن</div>
                                    )}
                                    {product.returnPeriodDays && (
                                        <div className="flex items-center gap-1 text-muted-foreground"><Icon name="RotateCw" size="xs" /> إرجاع {product.returnPeriodDays} يوم</div>
                                    )}
                                    {product.hasQualityGuarantee && (
                                        <div className="flex items-center gap-1 text-muted-foreground"><Icon name="ShieldCheck" size="xs" /> ضمان</div>
                                    )}
                                </div>
                                {product.features?.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold mb-1">المزايا السريعة:</h3>
                                        <ul className="list-disc pr-4 space-y-0.5 text-xs text-muted-foreground">
                                            {product.features.slice(0, 5).map((f, i) => (
                                                <li key={i}>{f}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="specsD">
                                        <AccordionTrigger className="text-sm">المواصفات التفصيلية</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                                {product.brand && (<div><span className="font-medium text-foreground">العلامة:</span> {product.brand}</div>)}
                                                {product.material && (<div><span className="font-medium text-foreground">المادة:</span> {product.material}</div>)}
                                                {product.color && (<div><span className="font-medium text-foreground">اللون:</span> {product.color}</div>)}
                                                {product.dimensions && (<div><span className="font-medium text-foreground">الأبعاد:</span> {product.dimensions}</div>)}
                                                {product.weight && (<div><span className="font-medium text-foreground">الوزن:</span> {product.weight}</div>)}
                                                {product.careInstructions && (<div className="col-span-2"><span className="font-medium text-foreground">العناية:</span> {product.careInstructions}</div>)}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                <div className="flex items-center gap-4 pt-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={async () => {
                                            const shareUrl = `${window.location.origin}/product/${product.slug}`;
                                            if (typeof navigator !== 'undefined' && navigator.share) {
                                                try {
                                                    await navigator.share({ title: product.name, text: product.name, url: shareUrl });
                                                    toast.success('تمت المشاركة بنجاح');
                                                } catch {
                                                    /* مشاركة ملغاة */
                                                }
                                            } else {
                                                if (navigator.clipboard && window.isSecureContext) {
                                                    await navigator.clipboard.writeText(shareUrl);
                                                    toast.success('تم نسخ رابط المنتج');
                                                } else {
                                                    const textArea = document.createElement('textarea');
                                                    textArea.value = shareUrl;
                                                    textArea.style.position = 'fixed';
                                                    textArea.style.opacity = '0';
                                                    document.body.appendChild(textArea);
                                                    textArea.select();
                                                    try { document.execCommand('copy'); toast.success('تم نسخ رابط المنتج'); } catch { }
                                                    document.body.removeChild(textArea);
                                                }
                                            }
                                        }}
                                        className="flex items-center gap-1 text-sm"
                                    >
                                        <Icon name="Share2" size="sm" /> مشاركة
                                    </Button>
                                    <Link href={`/product/${product.slug}`} className="text-sm text-blue-500 hover:underline">
                                        التفاصيل الكاملة ↗
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
} 