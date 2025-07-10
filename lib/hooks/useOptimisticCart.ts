import { useState, useCallback, useEffect } from 'react';
import {
  addItem,
  updateItemQuantityByProduct,
  removeItemByProduct,
  clearCart,
} from '@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions';
import { emitCartChanged, onCartChanged } from '@/lib/cart-events';

interface Deltas {
  [productId: string]: number; // positive or negative changes waiting for confirmation
}

export function useOptimisticCart() {
  const [deltas, setDeltas] = useState<Deltas>({});

  // Reset optimistic state whenever we receive a global cart change
  useEffect(() => {
    return onCartChanged(() => setDeltas({}));
  }, []);

  const applyDelta = (productId: string, delta: number) => {
    setDeltas((prev) => {
      const updated = { ...prev, [productId]: (prev[productId] ?? 0) + delta };
      // console.log('[useOptimisticCart] deltas after applyDelta:', updated); // Uncomment for debugging if needed
      return updated;
    });
  };

  /************ Public helpers ************/
  const add = useCallback(async (productId: string, qty: number = 1) => {
    applyDelta(productId, qty);
    try {
      await addItem(productId, qty);
    } catch (error) {
      // Show error in the browser for debugging
      alert('[Cart Add Error] ' + (error instanceof Error ? error.message : JSON.stringify(error)));
    } finally {
      emitCartChanged();
    }
  }, []);

  const inc = useCallback(async (productId: string) => {
    applyDelta(productId, 1);
    try {
      await updateItemQuantityByProduct(productId, 1);
    } finally {
      emitCartChanged();
    }
  }, []);

  const dec = useCallback(async (productId: string) => {
    applyDelta(productId, -1);
    try {
      await updateItemQuantityByProduct(productId, -1);
    } finally {
      emitCartChanged();
    }
  }, []);

  const remove = useCallback(async (productId: string) => {
    applyDelta(productId, Number.NEGATIVE_INFINITY); // wipe locally
    try {
      await removeItemByProduct(productId);
    } finally {
      emitCartChanged();
    }
  }, []);

  const clear = useCallback(async () => {
    setDeltas({});
    try {
      await clearCart();
    } finally {
      emitCartChanged();
    }
  }, []);

  /**
   * Returns the optimistic quantity (serverQty + local delta).
   * Call with the server quantity you already have (e.g. from getCart or props).
   */
  const quantityOf = useCallback(
    (productId: string, serverQty: number): number => {
      const delta = deltas[productId] ?? 0;
      if (delta === Number.NEGATIVE_INFINITY) return 0;
      return Math.max(0, serverQty + delta);
    },
    [deltas],
  );

  return {
    add,
    inc,
    dec,
    remove,
    clear,
    quantityOf,
  };
} 