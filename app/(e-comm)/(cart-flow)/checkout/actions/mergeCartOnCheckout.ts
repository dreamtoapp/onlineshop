'use server';
import { getCart } from '@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions';

export async function mergeCartOnCheckout() {
  return await getCart();
} 