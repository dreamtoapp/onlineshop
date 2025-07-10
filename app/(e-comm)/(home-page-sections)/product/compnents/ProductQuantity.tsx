'use client';

import { useState } from 'react';
import QuantityControls from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/CartQuantityControls';
import StoreAddToCartButton from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/AddToCartButton';
import WishlistButton from '@/app/(e-comm)/(home-page-sections)/product/cards/WishlistButton';
import { Product } from '@prisma/client';
import { useOptimisticCart } from '@/lib/hooks/useOptimisticCart';

export default function ProductQuantity({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { quantityOf } = useOptimisticCart();

  // Get the actual cart quantity for this product
  const cartQuantity = quantityOf(product.id, 0);
  const isInCart = cartQuantity > 0;

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className='space-y-4'>
      {isInCart ? (
        // Show cart-based quantity controls if product is in cart
        <div className="flex items-center justify-center">
          <QuantityControls productId={product.id} size="md" />
        </div>
      ) : (
        // Show manual quantity controls for initial add
        <div className='mt-2 flex items-center justify-center gap-2'>
          <button
            onClick={handleDecrease}
            className='h-10 w-10 rounded-full border border-border text-sm transition-colors duration-200 hover:bg-accent flex items-center justify-center'
          >
            -
          </button>
          <span className='text-sm font-medium text-foreground w-8 text-center'>{quantity}</span>
          <button
            onClick={handleIncrease}
            className='h-10 w-10 rounded-full border border-border text-sm transition-colors duration-200 hover:bg-accent flex items-center justify-center'
          >
            +
          </button>
        </div>
      )}

      <div className='flex flex-wrap gap-3 pt-2'>
        <StoreAddToCartButton
          product={product}
          quantity={isInCart ? cartQuantity : quantity}
          inStock={!product.outOfStock}
          size='lg'
        />

        <WishlistButton productId={product.id} className='p-2' size='lg' showBackground={true} />
      </div>
    </div>
  );
}
