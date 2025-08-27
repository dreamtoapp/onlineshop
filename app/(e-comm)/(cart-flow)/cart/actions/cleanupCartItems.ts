'use server';
import db from '@/lib/prisma';
import { revalidateTag } from 'next/cache';

export async function cleanupOrphanedCartItems() {
  try {
    console.log('Starting cleanup of orphaned cart items...');

    // Find all cart items where the referenced product doesn't exist
    const cartItemsWithProducts = await db.cartItem.findMany({
      include: { product: true }
    });

    const orphanedItems = cartItemsWithProducts.filter(item => !item.product);

    if (orphanedItems.length > 0) {
      console.log(`Found ${orphanedItems.length} orphaned cart items. Cleaning up...`);

      // Delete orphaned cart items
      const result = await db.cartItem.deleteMany({
        where: {
          id: {
            in: orphanedItems.map(item => item.id)
          }
        }
      });

      console.log(`Cleaned up ${result.count} orphaned cart items`);
      revalidateTag('cart');
      return { success: true, cleaned: result.count };
    }

    console.log('No orphaned cart items found');
    return { success: true, cleaned: 0 };
  } catch (error) {
    console.error('Error cleaning up orphaned cart items:', error);
    throw error;
  }
}

// Alternative approach using aggregation for better performance
export async function cleanupOrphanedCartItemsFast() {
  try {
    console.log('Starting fast cleanup of orphaned cart items...');

    // Get all product IDs that exist
    const existingProducts = await db.product.findMany({
      select: { id: true }
    });
    const existingProductIds = existingProducts.map(p => p.id);

    // Delete cart items that reference non-existent products
    const result = await db.cartItem.deleteMany({
      where: {
        productId: {
          notIn: existingProductIds
        }
      }
    });

    console.log(`Fast cleanup removed ${result.count} orphaned cart items`);
    revalidateTag('cart');
    return { success: true, cleaned: result.count };
  } catch (error) {
    console.error('Error in fast cleanup of orphaned cart items:', error);
    // Fall back to the safer method
    return await cleanupOrphanedCartItems();
  }
}
