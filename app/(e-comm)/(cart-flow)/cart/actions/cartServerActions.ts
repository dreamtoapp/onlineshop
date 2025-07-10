"use server";

import db from '@/lib/prisma';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { checkIsLogin } from '@/lib/check-is-login';
import { z } from 'zod';

// Types for cart with items and products
export type CartItemWithProduct = Awaited<ReturnType<typeof db.cartItem.findFirst>> & { product?: Awaited<ReturnType<typeof db.product.findFirst>> };
export type CartWithItems = Awaited<ReturnType<typeof db.cart.findFirst>> & { items?: CartItemWithProduct[] };

// Helper: get cart ID from cookie
async function getCartIdFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('localCartId')?.value;
}

// Helper: set cart ID cookie
async function setCartIdCookie(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set('localCartId', cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

// Helper: clear cart ID cookie
async function clearCartIdCookie() {
  const cookieStore = await cookies();
  cookieStore.set('localCartId', '', { maxAge: -1 });
}

// Helper: create a new guest cart
async function createGuestCart(): Promise<CartWithItems> {
  const newCart = await db.cart.create({
    data: {},
    include: {
      items: { include: { product: true } },
    },
  });
  return newCart;
}

// Get the current user's or guest's cart
export async function getCart(): Promise<CartWithItems | null> {
  const user = await checkIsLogin();
  const localCartId = await getCartIdFromCookie();

  // Logged-in user
  if (user) {
    let userCart = await db.cart.findUnique({
      where: { userId: user.id },
      include: { items: { include: { product: true } } },
    });

    // Merge guest cart if present
    if (localCartId) {
      const localCart = await db.cart.findUnique({
        where: { id: localCartId },
        include: { items: { include: { product: true } } },
      });
      if (localCart && localCart.items.length > 0) {
        if (userCart) {
          await db.$transaction(async (tx) => {
            for (const item of localCart.items) {
              if (!userCart) throw new Error('userCart is unexpectedly null');
              const existingItem = userCart.items.find(
                (i: typeof item) => i.productId === item.productId
              );
              if (existingItem) {
                await tx.cartItem.update({
                  where: { id: existingItem.id },
                  data: { quantity: existingItem.quantity + item.quantity },
                });
              } else {
                await tx.cartItem.create({
                  data: {
                    cartId: userCart.id,
                    productId: item.productId,
                    quantity: item.quantity,
                  },
                });
              }
            }
          });
          await db.cart.delete({ where: { id: localCartId } });
        } else {
          await db.cart.update({
            where: { id: localCartId },
            data: { userId: user.id },
          });
        }
        userCart = await db.cart.findUnique({
          where: { userId: user.id },
          include: { items: { include: { product: true } } },
        });
        await clearCartIdCookie();
      }
    }
    const result = userCart;
    return result;
  }

  // Guest
  if (localCartId) {
    return await db.cart.findUnique({
      where: { id: localCartId },
      include: { items: { include: { product: true } } },
    });
  }
  return null;
}

// Schema for quantity validation
const quantitySchema = z.number().int().min(1).max(99);

// Add item to cart (guest or user)
export async function addItem(productId: string, quantity: number = 1): Promise<void> {
  console.log('[addItem] called with:', { productId, quantity });
  const user = await checkIsLogin();
  let cart: CartWithItems | null = null;
  let cartId: string | undefined = await getCartIdFromCookie();
  console.log('[addItem] user:', user);
  console.log('[addItem] cartId before:', cartId);

  if (user) {
    cart = await db.cart.findUnique({ where: { userId: user.id } });
    if (!cart) {
      cart = await db.cart.create({ data: { userId: user.id } });
    }
    cartId = cart.id;
  } else {
    if (cartId) {
      cart = await db.cart.findUnique({ where: { id: cartId } });
    }
    if (!cart) {
      cart = await createGuestCart();
      cartId = cart.id;
      if (cartId) await setCartIdCookie(cartId);
    }
  }

  console.log('[addItem] cartId after:', cartId);
  // Log product quantity before add
  let qtyBefore = 0;
  if (cartId) {
    const cartBefore = await db.cart.findUnique({ where: { id: cartId }, include: { items: true } });
    const itemBefore = cartBefore?.items.find(i => i.productId === productId);
    qtyBefore = itemBefore?.quantity || 0;
    console.log(`[addItem] quantity before: ${qtyBefore}`);
  }

  const existingItem = await db.cartItem.findFirst({
    where: { cartId: cartId, productId },
  });

  if (existingItem) {
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await db.cartItem.create({
      data: {
        cartId: cartId!,
        productId,
        quantity: quantity,
      },
    });
  }

  // Log product quantity after add
  let qtyAfter = 0;
  if (cartId) {
    const cartAfter = await db.cart.findUnique({ where: { id: cartId }, include: { items: true } });
    const itemAfter = cartAfter?.items.find(i => i.productId === productId);
    qtyAfter = itemAfter?.quantity || 0;
    console.log(`[addItem] quantity after: ${qtyAfter}`);
  }

  revalidateTag('cart');
}

// Update quantity of a cart item
export async function updateItemQuantity(itemId: string, quantity: number): Promise<void> {
  if (quantity <= 0) {
    await removeItem(itemId);
    return;
  }

  const validQty = quantitySchema.parse(quantity);

  await db.cartItem.update({
    where: { id: itemId },
    data: { quantity: validQty },
  });

  revalidateTag('cart');
}

// Remove item from cart (and delete the cart itself if it becomes empty)
export async function removeItem(itemId: string): Promise<void> {
  // Find the cartId first (needed after deletion)
  const cartItem = await db.cartItem.findUnique({ where: { id: itemId } });
  if (!cartItem) {
    revalidateTag('cart');
    return;
  }

  await db.cartItem.delete({ where: { id: itemId } });

  // Check if the cart has any remaining items; if none, delete the cart
  const remaining = await db.cartItem.count({ where: { cartId: cartItem.cartId } });
  if (remaining === 0) {
    await db.cart.delete({ where: { id: cartItem.cartId } });
  }

  revalidateTag('cart');
}

// Merge guest cart into user cart on login
export async function mergeGuestCartOnLogin(guestCartId: string, userId: string): Promise<void> {
  const guestCart = await db.cart.findUnique({
    where: { id: guestCartId },
    include: { items: true },
  });
  let userCart = await db.cart.findUnique({ where: { userId } });
  if (!userCart) {
    userCart = await db.cart.create({ data: { userId } });
  }
  if (guestCart && guestCart.items.length > 0) {
    await db.$transaction(async (tx) => {
      for (const item of guestCart.items) {
        if (!userCart) throw new Error('userCart is unexpectedly null');
        const existingItem = await tx.cartItem.findFirst({
          where: { cartId: userCart.id, productId: item.productId },
        });
        if (existingItem) {
          await tx.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + item.quantity },
          });
        } else {
          await tx.cartItem.create({
            data: {
              cartId: userCart.id,
              productId: item.productId,
              quantity: item.quantity,
            },
          });
        }
      }
    });
    await db.cart.delete({ where: { id: guestCartId } });
  }
  revalidateTag('cart');
}

// Get the total number of items in the cart (for header badge)
export async function getCartCount(): Promise<number> {
  const cart = await getCart();
  if (!cart || !cart.items) return 0;
  return cart.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
}

// Clear cart for logged-in user or guest cart (by cookie)
export async function clearCart(): Promise<void> {
  // Delete cart for logged-in user or guest cart (by cookie)
  const user = await checkIsLogin();
  const localCartId = await getCartIdFromCookie();

  if (user) {
    // Remove user cart completely
    await db.cart.deleteMany({ where: { userId: user.id } });
  }

  if (localCartId) {
    try {
      await db.cart.delete({ where: { id: localCartId } });
    } catch (e) {
      // cart may not exist
    }
    await clearCartIdCookie();
  }

  revalidateTag('cart');
}

// Convenience: remove item using productId rather than itemId
export async function removeItemByProduct(productId: string): Promise<void> {
  const cart = await getCart();
  if (!cart || !cart.items) return;
  const item = cart.items.find((i) => i.productId === productId);
  if (!item) return;
  await removeItem(item.id);
}

// Update quantity using productId (positive or negative delta). If quantity <=0 after update, item is removed.
export async function updateItemQuantityByProduct(productId: string, delta: number): Promise<void> {
  const cart = await getCart();
  // Removed console.logs for cleaner build output
  if (!cart || !cart.items) return;
  const item = cart.items.find((i) => i.productId === productId);
  if (!item) return;
  const newQty = (item.quantity ?? 0) + delta;
  await updateItemQuantity(item.id, newQty);
} 