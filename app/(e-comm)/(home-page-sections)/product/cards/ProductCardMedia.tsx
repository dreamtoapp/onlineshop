"use client";
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { Icon } from '@/components/icons/Icon';
import type { Product } from '@/types/databaseTypes';
import ProductCardBadges from './ProductCardBadges';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import QuickViewModalContent from './QuickViewModalContent';

interface ProductCardMediaProps {
    product: Product;
    inCart: boolean;
    isOutOfStock: boolean;
    lowStock: boolean;
    stockQuantity?: number | null;
    priority?: boolean;
    logo?: string;
}

// Quick View Button Component
function QuickViewButton({ product, onOpen }: { product: Product; onOpen: () => void }) {
    return (
        <Button
            variant="secondary"
            size="icon"
            className="w-10 h-10 bg-white/90"
            aria-label={`معاينة سريعة لـ ${product.name}`}
            onClick={(e) => {
                e.stopPropagation();
                onOpen();
            }}
        >
            <Eye className="w-4 h-4 text-primary" />
        </Button>
    );
}

// Loading State Component
function LoadingState() {
    return (
        <div className="absolute inset-0 bg-gray-100 animate-pulse z-20">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-100"></div>
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-200"></div>
                </div>
            </div>
        </div>
    );
}

// Product Image Component
function ProductImage({
    src,
    alt,
    isLoading,
    onError,
    onLoad,
    priority
}: {
    src: string;
    alt: string;
    isLoading: boolean;
    onError: () => void;
    onLoad: () => void;
    priority?: boolean;
}) {
    return (
        <div className="relative w-full h-full overflow-hidden">
            <Image
                src={src}
                alt={alt}
                fill
                className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading={priority ? 'eager' : 'lazy'}
                onError={onError}
                onLoad={onLoad}
                priority={priority}
                quality={75}
            />
        </div>
    );
}

// Error Fallback Component
function ErrorFallback({ logo }: { logo: string }) {
    return (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-30">
            <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto mb-2 relative">
                    <Image
                        src={logo}
                        alt="Company Logo"
                        fill
                        className="object-contain"
                        sizes="64px"
                    />
                </div>
                <span className="text-sm text-gray-600">صورة غير متوفرة</span>
            </div>
        </div>
    );
}

// Status Badges Component
function StatusBadges({
    inCart,
    lowStock,
    stockQuantity,
    isOutOfStock
}: {
    inCart: boolean;
    lowStock: boolean;
    stockQuantity?: number | null;
    isOutOfStock: boolean;
}) {
    return (
        <>
            {inCart && (
                <div className="absolute left-2 bottom-2 bg-green-500 text-white p-1.5 rounded-full shadow-md z-25">
                    <Icon name="Check" size="sm" />
                </div>
            )}

            {lowStock && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium shadow-md z-25">
                    متبقي {stockQuantity}
                </div>
            )}

            {isOutOfStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-35">
                    <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">غير متوفر</span>
                </div>
            )}
        </>
    );
}

// Main ProductCardMedia Component
export default function ProductCardMedia({
    product,
    inCart,
    isOutOfStock,
    lowStock,
    stockQuantity,
    priority,
    logo = '/fallback/dreamToApp2-dark.png'
}: ProductCardMediaProps) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const formatNum = (n: number) => n.toLocaleString('ar-EG');
    const ratingFormatted = product.rating ? formatNum(Number(product.rating.toFixed(1))) : null;

    const imgSrc = useCallback(() => {
        if (imageError) return logo;
        return product.imageUrl || logo;
    }, [product.imageUrl, imageError, logo]);

    const handleImageError = useCallback(() => {
        setImageError(true);
        setImageLoading(false);
    }, []);

    const handleImageLoad = useCallback(() => {
        setImageLoading(false);
    }, []);

    return (
        <div className="relative w-full h-full overflow-hidden rounded-t-xl  bg-white" style={{ aspectRatio: '1/1' }}>
            {/* Product Image - Base Layer */}
            <div className="absolute inset-0 w-full h-full overflow-hidden ">
                <ProductImage
                    src={imgSrc()}
                    alt={product.name}
                    isLoading={imageLoading}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    priority={priority}
                />
            </div>

            {/* Loading State */}
            {imageLoading && <LoadingState />}

            {/* Error Fallback */}
            {imageError && <ErrorFallback logo={logo} />}

            {/* Quick View Button - Top Right Corner */}
            <div className="absolute top-2 right-2 z-30">
                <QuickViewButton product={product} onOpen={() => setOpen(true)} />
            </div>

            {/* Status Badges - Bottom Left Corner */}
            <StatusBadges
                inCart={inCart}
                lowStock={lowStock}
                stockQuantity={stockQuantity}
                isOutOfStock={isOutOfStock}
            />

            {/* Product Badges - Top Left Corner */}
            <ProductCardBadges product={product} />

            {/* QuickView Modal */}
            {open && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <QuickViewModalContent
                        product={product}
                        ratingFormatted={ratingFormatted}
                        formatNum={formatNum}
                        setOpen={setOpen}
                    />
                </Dialog>
            )}
        </div>
    );
} 