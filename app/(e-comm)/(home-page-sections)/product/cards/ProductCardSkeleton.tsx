'use client';
import { Card } from '@/components/ui/card';
import { memo } from 'react';

interface ProductCardSkeletonProps {
    className?: string;
    showActions?: boolean;
}

const ProductCardSkeleton = memo(({ className, showActions = true }: ProductCardSkeletonProps) => {
    return (
        <Card
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/95 
                       shadow-xl border-none min-h-[420px] sm:min-h-[520px] w-full max-w-sm mx-auto 
                       flex flex-col animate-pulse ${className || ''}`}
            role="status"
            aria-label="تحميل معلومات المنتج"
        >
            {/* Image Skeleton */}
            <div className="relative w-full aspect-square bg-muted rounded-t-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/70 rounded-t-2xl loading-shimmer" />

                {/* Badges placeholder */}
                <div className="absolute top-3 left-3 space-y-2">
                    <div className="w-12 h-5 bg-muted-foreground/20 rounded-full" />
                </div>

                {/* Wishlist button placeholder */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-muted-foreground/20 rounded-full" />
            </div>

            {/* Color swatches placeholder */}
            <div className="px-3 sm:px-5 pt-2">
                <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-muted-foreground/20 rounded-full" />
                    ))}
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col p-3 sm:p-5 gap-3">
                {/* Product Name & Type */}
                <div className="space-y-2">
                    <div className="h-6 bg-muted-foreground/20 rounded-md w-3/4" />

                    <div className="flex items-center justify-between">
                        <div className="h-5 bg-muted-foreground/20 rounded-full w-20" />
                        <div className="h-4 bg-muted-foreground/20 rounded w-16" />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <div className="h-4 bg-muted-foreground/20 rounded w-full" />
                        <div className="h-4 bg-muted-foreground/20 rounded w-4/5" />
                    </div>
                </div>

                {/* Rating placeholder */}
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-4 h-4 bg-muted-foreground/20 rounded" />
                        ))}
                    </div>
                    <div className="h-4 bg-muted-foreground/20 rounded w-12" />
                </div>

                {/* Stock indicator placeholder */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-muted-foreground/20 rounded-full" />
                        <div className="h-4 bg-muted-foreground/20 rounded w-32" />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-muted-foreground/20 rounded" />
                        <div className="h-4 bg-muted-foreground/20 rounded w-40" />
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-5 bg-muted-foreground/20 rounded-full w-20" />
                        <div className="h-4 bg-muted-foreground/20 rounded w-24" />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="h-4 bg-muted-foreground/20 rounded w-16" />
                            <div className="h-7 bg-muted-foreground/20 rounded w-20" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions Section */}
            {showActions && (
                <div className="p-3 sm:p-5 pt-0 space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="h-8 bg-muted-foreground/20 rounded w-8" />
                        <div className="h-4 bg-muted-foreground/20 rounded w-8" />
                        <div className="h-8 bg-muted-foreground/20 rounded w-8" />
                    </div>

                    <div className="h-10 bg-muted-foreground/20 rounded-md w-full" />
                </div>
            )}

            {/* Screen reader text */}
            <span className="sr-only">جاري تحميل بيانات المنتج...</span>
        </Card>
    );
});

ProductCardSkeleton.displayName = 'ProductCardSkeleton';

export default ProductCardSkeleton; 