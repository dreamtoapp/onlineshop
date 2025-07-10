// Zustand cart store: single source of truth, auth-aware (guest/server)
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/databaseTypes';
import { emitCartChanged } from '@/lib/cart-events';

// Cart item type
interface CartItem {
  product: Product;
  quantity: number;
}

// Cart state
interface CartState {
  cart: Record<string, CartItem>;
  isSyncing: boolean;
  lastSyncTime: number | null;
  addItem: (product: Product, quantity: number, isAuthenticated: boolean) => Promise<void>;
  updateQuantity: (productId: string, delta: number, isAuthenticated: boolean) => Promise<void>;
  removeItem: (productId: string, isAuthenticated: boolean) => Promise<void>;
  clearCart: (isAuthenticated: boolean) => Promise<void>;
  fetchServerCart: () => Promise<void>;
  mergeWithServerCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalUniqueItems: () => number;
  getTotalPrice: () => number;
}

// Helper: get effective price (discounted or not)
const getEffectivePrice = (product: Product) =>
  'discountedPrice' in product ? (product as any).discountedPrice : product.price;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: {},
      isSyncing: false,
      lastSyncTime: null,
      // Add item (auth-aware, pass isAuthenticated from component)
      addItem: async (product, quantity, isAuthenticated) => {
        if (isAuthenticated) {
          set({ isSyncing: true });
          const { addItem } = await import('@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions');
          await addItem(product.id, quantity);
          await get().fetchServerCart();
          set({ isSyncing: false });
        } else {
          set((state) => {
            const existing = state.cart[product.id];
            const newCart = {
              ...state.cart,
              [product.id]: {
                product,
                quantity: existing ? existing.quantity + quantity : quantity,
              },
            };
            emitCartChanged();
            return { cart: newCart };
          });
        }
      },
      // Update quantity (auth-aware)
      updateQuantity: async (productId, delta, isAuthenticated) => {
        if (isAuthenticated) {
          set({ isSyncing: true });
          const { updateItemQuantityByProduct } = await import('@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions');
          await updateItemQuantityByProduct(productId, delta);
          await get().fetchServerCart();
          set({ isSyncing: false });
        } else {
          set((state) => {
            const existing = state.cart[productId];
            if (!existing) return state;
            const newQty = Math.max(0, existing.quantity + delta);
            const newCart = { ...state.cart };
            if (newQty === 0) delete newCart[productId];
            else newCart[productId] = { ...existing, quantity: newQty };
            emitCartChanged();
            return { cart: newCart };
          });
        }
      },
      // Remove item (auth-aware)
      removeItem: async (productId, isAuthenticated) => {
        if (isAuthenticated) {
          set({ isSyncing: true });
          const { removeItemByProduct } = await import('@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions');
          await removeItemByProduct(productId);
          await get().fetchServerCart();
          set({ isSyncing: false });
        } else {
          set((state) => {
            const newCart = { ...state.cart };
            delete newCart[productId];
            emitCartChanged();
            return { cart: newCart };
          });
        }
      },
      // Clear cart (auth-aware)
      clearCart: async (isAuthenticated) => {
        if (isAuthenticated) {
          set({ isSyncing: true });
          const { clearCart } = await import('@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions');
          await clearCart();
          await get().fetchServerCart();
          set({ isSyncing: false });
        } else {
          set(() => ({ cart: {} }));
          emitCartChanged();
        }
      },
      // Fetch server cart (for logged-in)
      fetchServerCart: async () => {
        set({ isSyncing: true });
        try {
          const { getCart } = await import('@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions');
          const serverCart = await getCart();
          if (serverCart?.items && serverCart.items.length > 0) {
            const zustandCart: Record<string, CartItem> = {};
            serverCart.items.forEach((item: any) => {
              if (item.product) {
                zustandCart[item.productId] = {
                  product: item.product,
                  quantity: item.quantity || 1,
                };
              }
            });
            set({ cart: zustandCart, lastSyncTime: Date.now(), isSyncing: false });
          } else {
            set({ cart: {}, lastSyncTime: Date.now(), isSyncing: false });
          }
        } catch {
          set({ isSyncing: false });
        }
      },
      // Merge guest cart with server cart on login
      mergeWithServerCart: async () => {
        set({ isSyncing: true });
        try {
          const { cart } = get();
          const { getCart, clearCart, addItem } = await import('@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions');
          const serverCart = await getCart();
          const serverCartZustand: Record<string, CartItem> = {};
          if (serverCart?.items) {
            serverCart.items.forEach((item: any) => {
              if (item.product) {
                serverCartZustand[item.productId] = {
                  product: item.product,
                  quantity: item.quantity || 1,
                };
              }
            });
          }
          const mergedCart: Record<string, CartItem> = { ...serverCartZustand };
          Object.entries(cart).forEach(([productId, localItem]) => {
            if (mergedCart[productId]) {
              mergedCart[productId].quantity += localItem.quantity;
            } else {
              mergedCart[productId] = localItem;
            }
          });
          set({ cart: mergedCart });
          await clearCart();
          for (const [productId, item] of Object.entries(mergedCart)) {
            await addItem(productId, item.quantity);
          }
          await get().fetchServerCart();
          set({ lastSyncTime: Date.now(), isSyncing: false });
        } catch {
          set({ isSyncing: false });
        }
      },
      // Utility: total items
      getTotalItems: () => Object.values(get().cart).reduce((acc, item) => acc + item.quantity, 0),
      getTotalUniqueItems: () => Object.keys(get().cart).length,
      getTotalPrice: () =>
        Object.values(get().cart).reduce(
          (acc, item) => acc + item.quantity * getEffectivePrice(item.product),
          0,
        ),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart }),
    },
  ),
); 