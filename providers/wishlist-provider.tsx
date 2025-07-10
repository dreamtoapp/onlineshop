"use client";
import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";

interface WishlistContextProps {
    wishlistIds: Set<string>;
    toggle: (id: string) => void;
    isInWishlist: (id: string) => boolean;
}

export const WishlistContext = createContext<WishlistContextProps | null>(null);

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
    return ctx;
}

interface WishlistProviderProps {
    initialIds: string[];
    children: React.ReactNode;
}

export function WishlistProvider({ initialIds, children }: WishlistProviderProps) {
    const [ids, setIds] = useState<Set<string>>(new Set(initialIds));

    // load local storage for guests
    useEffect(() => {
        if (initialIds.length > 0) return; // user signed in already handled server-side
        try {
            const stored = JSON.parse(localStorage.getItem("wishlistIds") || "[]");
            if (Array.isArray(stored)) setIds(new Set(stored));
        } catch { }
    }, [initialIds.length]);

    const persistGuest = (set: Set<string>) => {
        localStorage.setItem("wishlistIds", JSON.stringify(Array.from(set)));
    };

    const toggle = useCallback((id: string) => {
        setIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            if (initialIds.length === 0) persistGuest(next);
            return next;
        });
    }, [initialIds.length]);

    const isInWishlist = useCallback((id: string) => ids.has(id), [ids]);

    const value = useMemo(() => ({ wishlistIds: ids, toggle, isInWishlist }), [ids, toggle, isInWishlist]);

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
} 