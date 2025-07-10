"use client";
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { Icon } from '@/components/icons/Icon';
import { Product } from '@/types/databaseTypes';
import ProductCardBadges from './ProductCardBadges';
import QuickViewButton from './QuickViewButton';
// Compare feature is postponed; component temporarily disabled
// import CompareButton from './CompareButton';
import WishlistButton from './WishlistButton';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductCardMediaProps {
    product: Product;
    inCart: boolean;
    isOutOfStock: boolean;
    lowStock: boolean;
    stockQuantity?: number | null;
}

export default function ProductCardMedia({ product, inCart, isOutOfStock, lowStock, stockQuantity }: ProductCardMediaProps) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    // Optimized image source with fallback
    const imgSrc = useCallback(() => {
        if (imageError) return '/fallback/product-fallback.avif';
        return product.imageUrl || '/fallback/product-fallback.avif';
    }, [product.imageUrl, imageError]);

    const handleImageError = useCallback(() => {
        setImageError(true);
        setImageLoading(false);
    }, []);

    const handleImageLoad = useCallback(() => {
        setImageLoading(false);
    }, []);

    return (
        <div className="relative h-36 sm:h-48 w-full overflow-hidden rounded-t-2xl bg-white p-1 shadow-lg border border-gray-100 flex items-center justify-center">
            {/* Icon actions: wishlist and quick view, top-right */}
            <div className="absolute top-2 right-2 z-30 flex flex-col gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-md">
                <WishlistButton productId={product.id} />
                <QuickViewButton product={product} />
            </div>
            {/* Loading state */}
            {imageLoading && (
                <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-t-2xl bg-gradient-to-r from-primary/20 via-muted/80 to-primary/20 animate-pulse [mask-image:linear-gradient(90deg,transparent,white,transparent)]" />
            )}

            {/* Product image with optimized loading */}
            <Image
                src={imgSrc()}
                alt={product.name}
                fill
                className={`object-contain w-full h-full rounded-t-2xl transition-all duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJyBoZWlnaHQ9JzEwMCcgdmlld0JveD0nMCAwIDEwMCAxMDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsbD0nI2ZmZicvPjwvc3ZnPg=="
                onError={handleImageError}
                onLoad={handleImageLoad}
                priority={false}
                quality={75}
                unoptimized={imageError} // Skip optimization for fallback images
            />

            {/* Image error fallback */}
            {imageError && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-muted/50">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Icon name="ImageOff" size="lg" />
                        <span className="text-xs">صورة غير متوفرة</span>
                    </div>
                </div>
            )}

            {/* In cart check */}
            {inCart && (
                <div className="absolute left-3 bottom-3 z-30 rounded-full bg-green-500 p-2 text-white shadow-lg animate-in fade-in-0 zoom-in-95 duration-300">
                    <Icon name="Check" size="md" />
                </div>
            )}

            {/* Rating and preview badge combined */}
            {/* {(product.rating && product.rating > 0) && (
                <Link
                    href={`/product/${product.slug}#reviews`}
                    className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1.5 text-white backdrop-blur-sm shadow-sm hover:bg-black/90 transition"
                    tabIndex={0}
                    aria-label={`عرض تقييمات ${product.name}`}
                    onClick={e => e.stopPropagation()}
                >
                    <Icon name="Star" size="xs" className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium underline">{product.rating.toFixed(1)}</span>
                    <span className="text-xs">({typeof product.reviewCount === 'number' ? product.reviewCount : 0})</span>
                    <Icon name="Eye" size="xs" className="ml-1" />
                    <span className="text-xs">{typeof product.previewCount === 'number' ? product.previewCount : 0}</span>
                </Link>
            )} */}

            {/* Low stock badge */}
            {lowStock && (
                <div className="absolute top-3 left-3 z-30 flex items-center gap-1 rounded-lg bg-orange-500/90 px-2.5 py-1.5 text-white shadow-md">
                    <Icon name="AlertTriangle" size="xs" />
                    <span className="text-[10px] font-semibold">متبقي {stockQuantity}</span>
                </div>
            )}

            {/* Out of stock overlay */}
            {isOutOfStock && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <span className="rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground">غير متوفر</span>
                </div>
            )}

            {/* Quick actions */}
            <div
                className="absolute bottom-2 right-2 z-30 flex gap-2 sm:bottom-3 sm:right-3 sm:flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* <CompareButton productId={product.id} /> */}
            </div>

            {/* Sale / New badges */}
            <ProductCardBadges product={product} />
        </div>
    );
} 