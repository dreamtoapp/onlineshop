'use client';
import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { Product } from '@/types/databaseTypes';
import dynamic from 'next/dynamic';
import ProductCardMedia from './ProductCardMedia';
import ProductCardActions from './ProductCardActions';
import { useRouter } from 'next/navigation';
import { useProductCardOptimizations } from '@/lib/hooks/useProductCardOptimizations';
import Link from 'next/link';

const Notification = dynamic(() => import('@/app/(e-comm)/(home-page-sections)/product/cards/NotificationSection'), { ssr: false });

interface ProductCardProps {
    product: Product;
    quantity: number;
    isInCart: boolean;
    className?: string;
    index?: number; // For analytics tracking
}

const ProductCard = memo(({
    product,
    quantity,
    isInCart,
    className,
    index
}: ProductCardProps) => {
    const router = useRouter();
    const [currentCartState, setCurrentCartState] = useState(isInCart);
    const [isHovered, setIsHovered] = useState(false);

    // Performance optimizations
    const {
        cardRef,
        handleMouseEnter: optimizedMouseEnter,
        handleMouseLeave: optimizedMouseLeave,
        preloadImages
    } = useProductCardOptimizations({
        productId: product.id,
        onVisible: () => {
            // Preload images when card becomes visible
            if (product.imageUrl) {
                preloadImages([product.imageUrl]);
            }
        },
        onHover: () => {
            // Additional hover logic if needed
        },
        trackAnalytics: true
    });

    // Memoized calculations for performance
    const stockInfo = useMemo(() => {
        const isOutOfStock = product.outOfStock || (product.manageInventory && (product.stockQuantity ?? 0) <= 0);
        const lowStock = !isOutOfStock && product.manageInventory && (product.stockQuantity ?? 0) > 0 && (product.stockQuantity ?? 0) <= 3;
        return { isOutOfStock, lowStock };
    }, [product.outOfStock, product.manageInventory, product.stockQuantity]);

    // Memoized pricing calculations
    const pricingInfo = useMemo(() => {
        const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
        const discountPercentage = hasDiscount && product.compareAtPrice
            ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
            : 0;
        return { hasDiscount, discountPercentage };
    }, [product.compareAtPrice, product.price]);

    // Sync internal cart state with prop changes
    useEffect(() => {
        setCurrentCartState(isInCart);
    }, [isInCart]);

    // Analytics tracking
    const trackProductView = useCallback(() => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'view_item', {
                currency: 'USD',
                value: product.price,
                items: [{
                    item_id: product.id,
                    item_name: product.name,
                    item_category: product.type,
                    price: product.price,
                    quantity: 1,
                    index: index
                }]
            });
        }
    }, [product, index]);

    // Keyboard navigation handler
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            trackProductView();
            router.push(`/product/${product.slug}`);
        }
    }, [router, product.slug, trackProductView]);

    // Structured data for SEO
    const structuredData = useMemo(() => ({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.details,
        "image": product.imageUrl,
        "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "USD",
            "availability": stockInfo.isOutOfStock ? "OutOfStock" : "InStock"
        }
    }), [product, stockInfo.isOutOfStock]);

    return (
        <>
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <Card
                ref={cardRef}
                className={`group relative overflow-hidden rounded-2xl bg-card
                           shadow-md hover:shadow-xl border border-border transition-all duration-200 ease-out 
                           card-hover-effect flex flex-col h-full cursor-pointer transform hover:-translate-y-1 ${className || ''}`}
                tabIndex={0}
                role="article"
                aria-labelledby={`product-${product.id}-title`}
                aria-describedby={`product-${product.id}-description`}
                onKeyDown={handleKeyDown}
                onMouseEnter={() => {
                    optimizedMouseEnter();
                    setIsHovered(true);
                }}
                onMouseLeave={() => {
                    optimizedMouseLeave();
                    setIsHovered(false);
                }}
                onClick={() => {
                    trackProductView();
                    router.push(`/product/${product.slug}`);
                }}
            >
                {/* Screen reader only product summary */}
                <div className="sr-only">
                    <h2 id={`product-${product.id}-title`}>{product.name}</h2>
                    <p id={`product-${product.id}-description`}>
                        {product.details} - السعر: {product.price} ر.س
                        {stockInfo.isOutOfStock ? ' - غير متوفر' : ' - متوفر'}
                    </p>
                </div>

                {/* Badges Container */}
                {/* Remove badge rendering here to avoid duplicate discount badges. Only ProductCardMedia will render the badge. */}

                {/* Product Media */}
                <div className="relative overflow-hidden">
                    <ProductCardMedia
                        product={product}
                        inCart={currentCartState}
                        isOutOfStock={stockInfo.isOutOfStock}
                        lowStock={stockInfo.lowStock}
                        stockQuantity={product.stockQuantity}
                    />

                    {/* Hover overlay effect */}
                    <div className={`absolute inset-0 bg-background/10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-3 p-5 flex-1">
                    {/* Brand */}
                    {product.brand && (
                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{product.brand}</div>
                    )}

                    {/* Product Title */}
                    <div className="flex-1 flex items-center justify-between">
                        <h3 className="font-bold text-lg leading-tight text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300"
                            title={product.name}>
                            {product.name}
                        </h3>
                        <Link
                            href={`/product/${product.slug}`}
                            className="ml-2 text-primary hover:text-primary/80 transition"
                            tabIndex={0}
                            aria-label="عرض تفاصيل المنتج"
                        >
                            <Icon name="FaInfoCircle" size="sm" />
                        </Link>
                    </div>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Icon
                                        key={i}
                                        name="FaStar"
                                        size="xs"
                                        className={`${i < Math.floor(product.rating ?? 0) ? 'text-primary' : 'text-muted'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-foreground font-medium">{product.rating ?? '--'}</span>
                        </div>
                        <span className="text-muted-foreground">({product.reviewCount ?? 0} تقييم)</span>
                    </div>

                    {/* Price Section */}
                    <div className="flex items-end justify-between mb-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-foreground">{product.price} ر.س</span>
                                {pricingInfo.hasDiscount && (
                                    <span className="text-sm text-muted-foreground line-through">{product.compareAtPrice} ر.س</span>
                                )}
                            </div>
                            {pricingInfo.hasDiscount && (
                                <div className="text-sm text-primary font-medium">
                                    توفر {((product.compareAtPrice ?? 0) - product.price).toFixed(2)} ر.س
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stock & Shipping Info */}
                    <div className="flex items-center justify-between text-xs mb-4">
                        {/* Stock Status */}
                        {stockInfo.isOutOfStock ? (
                            <div className="flex items-center gap-1 text-destructive bg-destructive/10 px-2 py-1 rounded-full">
                                <Icon name="X" size="xs" />
                                <span>غير متوفر</span>
                            </div>
                        ) : stockInfo.lowStock ? (
                            <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-full">
                                <Icon name="FaExclamationTriangle" size="xs" />
                                <span>متبقي ({product.stockQuantity})</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-full">
                                <Icon name="FaCheck" size="xs" />
                                <span>متوفر</span>
                            </div>
                        )}

                        {/* Shipping Info */}
                        {product.shippingDays && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <Icon name="Truck" size="xs" />
                                <span>شحن {product.shippingDays} أيام</span>
                            </div>
                        )}
                    </div>

                    {/* Views Counter */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                        <Icon name="FaEye" size="xs" />
                        <span>{product.previewCount ?? 0} مشاهدة</span>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto">
                        <ProductCardActions
                            product={product}
                            quantity={quantity}
                            isOutOfStock={stockInfo.isOutOfStock}
                        />
                    </div>
                </div>

                {/* Notification overlay */}
                <Notification
                    show={false}
                    type="add"
                    message="تمت الإضافة إلى السلة"
                />
                <Notification
                    show={false}
                    type="remove"
                    message="تمت الإزالة من السلة"
                />
            </Card>
        </>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard; 