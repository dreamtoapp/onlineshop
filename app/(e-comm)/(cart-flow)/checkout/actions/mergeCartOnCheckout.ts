'use server';
import db from '@/lib/prisma';
import { checkIsLogin } from '@/lib/check-is-login';
import { cookies } from 'next/headers';

async function getCartIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('localCartId')?.value || null;
}

export async function mergeCartOnCheckout() {
  const user = await checkIsLogin();
  const localCartId = await getCartIdFromCookie();

  // ULTRA-SAFE cart query with comprehensive error handling
  const safeGetCart = async (where: any) => {
    try {
      console.log('[mergeCartOnCheckout] Attempting safe cart query with:', where);

      // First, get cart without product relation to avoid the error
      const cart = await db.cart.findUnique({
        where,
        include: { items: true }, // Only get items, not products yet
      });

      if (!cart || !cart.items || cart.items.length === 0) {
        console.log('[mergeCartOnCheckout] No cart or items found');
        return cart;
      }

      // Now safely get products for each item
      const safeItems: any[] = [];
      const orphanedItemIds: string[] = [];

      for (const item of cart.items) {
        try {
          const product = await db.product.findUnique({
            where: { id: item.productId }
          });

          if (product) {
            safeItems.push({ ...item, product });
          } else {
            console.log(`[mergeCartOnCheckout] Found orphaned item: ${item.id} for product: ${item.productId}`);
            orphanedItemIds.push(item.id);
          }
        } catch (productError) {
          console.error(`[mergeCartOnCheckout] Error fetching product ${item.productId}:`, productError);
          orphanedItemIds.push(item.id);
        }
      }

      // Clean up orphaned items immediately and non-blocking
      if (orphanedItemIds.length > 0) {
        console.log(`[mergeCartOnCheckout] Cleaning up ${orphanedItemIds.length} orphaned items`);
        Promise.resolve().then(async () => {
          try {
            await db.cartItem.deleteMany({
              where: { id: { in: orphanedItemIds } }
            });
            console.log(`[mergeCartOnCheckout] Successfully cleaned up ${orphanedItemIds.length} orphaned items`);
          } catch (cleanupError) {
            console.error('[mergeCartOnCheckout] Cleanup error:', cleanupError);
          }
        });
      }

      return { ...cart, items: safeItems };

    } catch (error) {
      console.error('[mergeCartOnCheckout] Cart query failed:', error);
      // Return empty cart structure to prevent complete failure
      return { id: '', userId: user?.id || null, items: [], createdAt: new Date(), updatedAt: new Date() };
    }
  };

  if (user) {
    console.log('[mergeCartOnCheckout] Getting user cart for:', user.id);
    return await safeGetCart({ userId: user.id });
  }

  // Guest - return local cart if exists
  if (localCartId) {
    console.log('[mergeCartOnCheckout] Getting guest cart for:', localCartId);
    return await safeGetCart({ id: localCartId });
  }

  console.log('[mergeCartOnCheckout] No user or cart ID found');
  return null;
} 