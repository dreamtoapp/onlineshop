'use client';
import React, { useState } from 'react';
import { Icon } from '@/components/icons/Icon';
import QuantityControls from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/CartQuantityControls';
import { useCartStore } from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/cartStore';
import { Product } from '@/types/databaseTypes';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { useCheckIsLogin } from '@/hooks/use-check-islogin';

// Lazy load modal for performance
const AddToCartModal = dynamic(() => import('@/app/(e-comm)/(cart-flow)/cart/components/AddToCartModal'), { ssr: false });

interface ProductCardActionsProps {
    product: Product;
    quantity: number;
    isOutOfStock: boolean;
}

const ProductCardActions = React.memo(function ProductCardActions({
    product,
    quantity,
    isOutOfStock,
}: ProductCardActionsProps) {
    const { addItem } = useCartStore();
    const { isAuthenticated } = useCheckIsLogin();
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Open modal instead of direct add
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    // Confirm add to cart from modal
    const handleConfirm = async (qty: number) => {
        setLoading(true);
        try {
            await addItem(product, qty, isAuthenticated);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 mt-auto" onClick={(e) => e.stopPropagation()}>
            {quantity > 0 ? (
                <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm rounded-full p-1.5 border border-border/50">
                    <QuantityControls productId={product.id} size="sm" />
                </div>
            ) : (
                <>
                    <Button
                        onClick={handleOpenModal}
                        variant="default"
                        size="lg"
                        className="w-full flex items-center justify-center gap-2 font-bold text-lg"
                        disabled={loading || isOutOfStock}
                        aria-label={`أضف ${product.name} إلى السلة`}
                    >
                        <Icon name="FaCartPlus" size="sm" />
                        <span className="font-semibold text-lg">{loading ? 'جاري الإضافة...' : isOutOfStock ? 'نفد المخزون' : 'أضف إلى السلة'}</span>
                    </Button>
                    {/* Modal for add to cart confirmation */}
                    <AddToCartModal
                        open={modalOpen}
                        onClose={handleCloseModal}
                        product={product}
                        onConfirm={handleConfirm}
                    />
                </>
            )}
        </div>
    );
});

export default ProductCardActions; 