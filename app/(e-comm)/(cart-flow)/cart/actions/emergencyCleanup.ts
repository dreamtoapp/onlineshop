"use server";

import db from '@/lib/prisma';

/**
 * Emergency cleanup function to remove all orphaned cart items
 * Call this manually if needed to clean the database
 */
export async function emergencyCleanupOrphanedCartItems() {
  try {
    console.log('[emergencyCleanup] Starting cleanup of orphaned cart items...');

    // Find all cart items where the product doesn't exist
    const orphanedItems = await db.cartItem.findMany({
      select: {
        id: true,
        productId: true,
        cartId: true,
      }
    });

    console.log(`[emergencyCleanup] Found ${orphanedItems.length} total cart items to check`);

    const itemsToDelete = [];

    for (const item of orphanedItems) {
      const productExists = await db.product.findUnique({
        where: { id: item.productId },
        select: { id: true }
      });

      if (!productExists) {
        itemsToDelete.push(item.id);
        console.log(`[emergencyCleanup] Marking orphaned item ${item.id} for deletion (product ${item.productId} not found)`);
      }
    }

    if (itemsToDelete.length > 0) {
      console.log(`[emergencyCleanup] Deleting ${itemsToDelete.length} orphaned cart items...`);

      const deleteResult = await db.cartItem.deleteMany({
        where: {
          id: { in: itemsToDelete }
        }
      });

      console.log(`[emergencyCleanup] Successfully deleted ${deleteResult.count} orphaned cart items`);

      // Also clean up any empty carts
      const emptyCarts = await db.cart.findMany({
        where: {
          items: {
            none: {}
          }
        },
        select: { id: true }
      });

      if (emptyCarts.length > 0) {
        await db.cart.deleteMany({
          where: {
            id: { in: emptyCarts.map(cart => cart.id) }
          }
        });
        console.log(`[emergencyCleanup] Deleted ${emptyCarts.length} empty carts`);
      }

      return {
        success: true,
        deletedItems: deleteResult.count,
        deletedEmptyCarts: emptyCarts.length,
        message: `Cleanup completed: ${deleteResult.count} orphaned items and ${emptyCarts.length} empty carts removed`
      };
    } else {
      console.log('[emergencyCleanup] No orphaned items found');
      return {
        success: true,
        deletedItems: 0,
        deletedEmptyCarts: 0,
        message: 'No orphaned items found - database is clean'
      };
    }

  } catch (error) {
    console.error('[emergencyCleanup] Error during cleanup:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Cleanup failed'
    };
  }
}

/**
 * Get statistics about cart health
 */
export async function getCartHealthStats() {
  try {
    const totalCartItems = await db.cartItem.count();
    const totalCarts = await db.cart.count();

    // Count orphaned items
    const cartItems = await db.cartItem.findMany({
      select: { id: true, productId: true }
    });

    let orphanedCount = 0;
    for (const item of cartItems) {
      const productExists = await db.product.findUnique({
        where: { id: item.productId },
        select: { id: true }
      });
      if (!productExists) {
        orphanedCount++;
      }
    }

    const emptyCarts = await db.cart.count({
      where: { items: { none: {} } }
    });

    return {
      totalCarts,
      totalCartItems,
      orphanedItems: orphanedCount,
      emptyCarts,
      healthPercentage: totalCartItems > 0 ? ((totalCartItems - orphanedCount) / totalCartItems * 100).toFixed(2) : 100
    };

  } catch (error) {
    console.error('[getCartHealthStats] Error:', error);
    return null;
  }
}



