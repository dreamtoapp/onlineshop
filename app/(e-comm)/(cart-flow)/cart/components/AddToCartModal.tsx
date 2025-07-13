import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import Image from 'next/image';
import CartQuantityControls from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/CartQuantityControls';

// Product Image Component
function ProductImage({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="w-full flex justify-center">
            <div className="relative w-full max-w-xs h-40 sm:h-56 bg-gray-100 rounded-2xl shadow-md overflow-hidden">
                <Image
                    src={src}
                    alt={alt}
                    className="object-cover w-full h-full"
                    width={320}
                    height={320}
                    loading="lazy"
                    onError={e => (e.currentTarget.src = '/fallback/product-fallback.avif')}
                />
            </div>
        </div>
    );
}

// Product Info Component
function ProductInfo({ product }: { product: any }) {
    return (
        <div className="flex flex-col items-center gap-1 w-full">
            <div className="text-2xl font-bold text-primary">{product.price} ر.س</div>
            <div className="flex items-center justify-between w-full gap-1 text-xs text-yellow-500">
                <div className="flex items-center gap-1 text-xs text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                        <Icon
                            key={i}
                            name="Star"
                            size="xs"
                            className={i < Math.floor(product.rating ?? 0) ? 'text-yellow-500' : 'text-gray-300'}
                        />
                    ))}
                    <span>{product.rating ?? '--'}</span>
                    <span className="text-muted-foreground">({product.reviewCount ?? 0})</span>
                </div>
                <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                    {!product.outOfStock ? (
                        <div className="text-xs text-green-600">متوفر</div>
                    ) : (
                        <div className="text-xs text-destructive">غير متوفر</div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Action Footer Component
function ActionFooter({ loading, onConfirm, onClose, disabled }: { loading: boolean; onConfirm: () => void; onClose: () => void; disabled: boolean }) {
    return (
        <DialogFooter className="flex flex-col gap-2 mt-4 bg-background z-10 p-2 sm:static sm:bg-transparent">
            <Button
                onClick={onConfirm}
                disabled={loading || disabled}
                className="w-full py-3 text-base font-bold"
                aria-busy={loading}
            >
                {loading ? <span className="animate-spin inline-block mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full align-middle" aria-label="جاري الإضافة"></span> : null}
                {loading ? '...جاري الإضافة' : 'أضف إلى السلة'}
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full py-3 text-base">إلغاء</Button>
        </DialogFooter>
    );
}

interface AddToCartModalProps {
    open: boolean;
    onClose: () => void;
    product: any; // Replace 'any' with your Product type
    onConfirm: (quantity: number, options?: Record<string, any>) => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ open, onClose, product, onConfirm }) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            // You may want to get the current cart quantity here if needed
            await onConfirm(1); // Default to 1 or get from cart if needed
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="max-w-md w-full p-3 sm:p-5 flex flex-col gap-3 rounded-2xl shadow-xl max-h-[90vh]"
                aria-modal="true"
                role="dialog"
                tabIndex={-1}
            >
                <div className="overflow-y-auto flex-1">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold mb-1">{product.name}</DialogTitle>
                        {product.brand && <span className="text-xs text-muted-foreground">({product.brand})</span>}
                        {product.description && <span className="text-xs text-muted-foreground line-clamp-2">{product.description}</span>}
                    </DialogHeader>
                    <ProductImage src={product.imageUrl} alt={product.name || 'صورة المنتج'} />
                    <ProductInfo product={product} />
                    <div className="flex justify-center mt-2">
                        <CartQuantityControls productId={product.id} size="md" />
                    </div>
                </div>
                <ActionFooter loading={loading} onConfirm={handleConfirm} onClose={onClose} disabled={product.stockQuantity === 0} />
            </DialogContent>
        </Dialog>
    );
};

export default React.memo(AddToCartModal); 