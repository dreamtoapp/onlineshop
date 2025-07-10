import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from './cartStore';
import { useCheckIsLogin } from '@/hooks/use-check-islogin';

interface CartQuantityControlsProps {
    productId: string;
    size?: 'sm' | 'md';
}

/**
 * Reusable + / – quantity controller wired to useCartStore.
 * Renders nothing if the product is not yet in the cart (qty === 0).
 */
const CartQuantityControls: React.FC<CartQuantityControlsProps> = ({ productId, size = 'md' }) => {
    const { cart, updateQuantity } = useCartStore();
    const { isAuthenticated } = useCheckIsLogin();
    const [isLoading, setIsLoading] = useState(false);
    const qty = cart[productId]?.quantity || 0;

    if (qty === 0) return null; // product not yet in cart

    const btnSize = size === 'sm' ? 'icon' : 'default';

    const handleInc = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await updateQuantity(productId, 1, isAuthenticated);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDec = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await updateQuantity(productId, -1, isAuthenticated);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex items-center gap-2'>
            <Button
                variant='outline'
                size={btnSize}
                onClick={handleInc}
                disabled={isLoading}
                className='h-8 w-8 rounded-full'
                aria-label='Increase quantity'
            >
                +
            </Button>
            <span className='text-sm font-medium w-6 text-center select-none'>{qty}</span>
            <Button
                variant='outline'
                size={btnSize}
                onClick={handleDec}
                disabled={isLoading}
                className='h-8 w-8 rounded-full'
                aria-label='Decrease quantity'
            >
                –
            </Button>
        </div>
    );
};

export default CartQuantityControls; 