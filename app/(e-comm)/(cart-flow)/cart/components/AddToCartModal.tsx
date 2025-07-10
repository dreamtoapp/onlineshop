import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import WishlistButton from '@/app/(e-comm)/(home-page-sections)/product/cards/WishlistButton';
import Image from 'next/image';
// Import types as needed
// import { Product } from '@/types/databaseTypes';

interface AddToCartModalProps {
    open: boolean;
    onClose: () => void;
    product: any; // Replace 'any' with your Product type
    onConfirm: (quantity: number, options?: Record<string, any>) => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ open, onClose, product, onConfirm }) => {
    const [quantity, setQuantity] = useState(1);
    // Add state for options if needed (size, color, etc.)
    // const [selectedSize, setSelectedSize] = useState<string | null>(null);
    // const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Performance: avoid unnecessary re-renders
    const handleQuantityChange = (delta: number) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            // Pass options if needed
            await onConfirm(quantity);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!product) return null;

    // Mobile-first: vertical stack, sticky button
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md w-full p-2 sm:p-4 flex flex-col gap-2">
                <DialogHeader>
                    <DialogTitle className="flex flex-col items-start gap-1 w-full">
                        <span className="text-lg font-bold">{product.name}</span>
                        {product.brand && <span className="text-xs text-muted-foreground">({product.brand})</span>}
                        {/* Short description */}
                        {product.description && <span className="text-xs text-muted-foreground line-clamp-2">{product.description}</span>}
                    </DialogTitle>
                </DialogHeader>
                {/* Product image and wishlist (responsive layout) */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch w-full">
                    {/* Image section */}
                    <div className="relative flex-shrink-0 flex items-center justify-center sm:w-48 w-full">
                        <div className="relative w-full sm:w-48 h-48 sm:h-64 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center overflow-hidden">
                            <Image
                                src={product.imageUrl}
                                alt={product.name || 'صورة المنتج'}
                                className="object-contain w-full h-full transition-transform duration-300 rounded-xl bg-white"
                                width={192}
                                height={256}
                                loading="lazy"
                                onError={e => (e.currentTarget.src = '/fallback/product-fallback.avif')}
                            />
                            {/* Wishlist button overlays image */}
                            <div className="absolute top-2 right-2 z-20">
                                <WishlistButton productId={product.id} size="md" showBackground />
                            </div>
                        </div>
                    </div>
                    {/* Details section */}
                    <div className="flex flex-col gap-2 flex-1 w-full justify-between">
                        {/* Title, brand, description */}
                        <div className="flex flex-col gap-1">
                            <span className="text-lg font-bold leading-tight">{product.name}</span>
                            {product.brand && <span className="text-xs text-muted-foreground">({product.brand})</span>}
                            {product.description && <span className="text-xs text-muted-foreground line-clamp-2">{product.description}</span>}
                        </div>
                        {/* Price */}
                        <div className="text-2xl font-bold text-primary mt-2">{product.price} ر.س</div>
                        {/* Rating and reviews */}
                        <div className="flex items-center gap-1 text-xs text-yellow-500">
                            <Icon name="FaStar" size="xs" />
                            <span>{product.rating ?? '--'}</span>
                            <span className="text-muted-foreground">({product.reviewCount ?? 0})</span>
                        </div>
                        {/* Stock status */}
                        {product.stockQuantity > 0 ? (
                            <div className={`text-xs ${product.stockQuantity <= 3 ? 'text-red-600 font-bold' : 'text-green-600'}`}>
                                {product.stockQuantity <= 3 ? `متبقي فقط (${product.stockQuantity})` : `متوفر (${product.stockQuantity})`}
                            </div>
                        ) : (
                            <div className="text-xs text-destructive">غير متوفر</div>
                        )}
                        {/* Shipping info */}
                        {product.shippingDays && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Icon name="Truck" size="xs" />
                                <span>شحن {product.shippingDays} أيام</span>
                            </div>
                        )}
                        {/* Return policy */}
                        {product.returnPeriodDays && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Icon name="FaUndo" size="xs" />
                                <span>استرجاع خلال {product.returnPeriodDays} يوم</span>
                            </div>
                        )}
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                            <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} aria-label="نقص الكمية">-</Button>
                            <span className="w-8 text-center">{quantity}</span>
                            <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)} aria-label="زيادة الكمية">+</Button>
                        </div>
                    </div>
                </div>
                {/* Sticky footer for mobile: confirm/cancel */}
                <DialogFooter className="flex gap-2 mt-4 sticky bottom-0 bg-background z-10 p-2 sm:static sm:bg-transparent">
                    <Button onClick={handleConfirm} disabled={loading || product.stockQuantity === 0} className="flex-1">
                        {loading ? '...جاري الإضافة' : 'أضف إلى السلة'}
                    </Button>
                    <Button variant="outline" onClick={onClose} className="flex-1">إلغاء</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default React.memo(AddToCartModal); 