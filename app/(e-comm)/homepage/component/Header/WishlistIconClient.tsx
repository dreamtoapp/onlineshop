"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from '@/components/icons/Icon';
import LoginPromptModal from './LoginPromptModal';
// Import SWR for data fetching
import useSWR from 'swr';
import Link from '@/components/link';

// Fetcher function for SWR
async function fetchWishlistCount() {
    const res = await fetch('/api/user/wishlist/count');
    if (!res.ok) throw new Error('Failed to fetch wishlist count');
    const data = await res.json();
    return data.count;
}

export default function WishlistIconClient({ isLoggedIn = false, userId }: { isLoggedIn?: boolean, userId?: string }) {
    const [showPrompt, setShowPrompt] = useState(false);
    // Use SWR to fetch wishlist count if logged in
    const { data: count, isLoading } = useSWR(isLoggedIn && userId ? `/api/user/wishlist/count?userId=${userId}` : null, fetchWishlistCount);

    if (!isLoggedIn) {
        return (
            <>
                <div className="w-12 h-12 flex items-center justify-center p-2 relative">
                    <Button
                        variant="ghost"
                        className="relative flex items-center  gap-2 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-feature-users/20"
                        onClick={() => setShowPrompt(true)}
                    >
                        <Icon name="Heart" className="h-7 w-7 text-foreground" />
                    </Button>
                </div>
                <LoginPromptModal open={showPrompt} onOpenChange={setShowPrompt} message="يجب تسجيل الدخول أو إنشاء حساب لإضافة المنتجات إلى المفضلة." />
            </>
        );
    }

    return (
        <Link href={userId ? `/user/wishlist/${userId}` : '/user/wishlist'} className="w-12 h-12 flex items-center justify-center p-2 relative">
            <Icon name="Heart" className="h-7 w-7 text-foreground" />
            {isLoading ? (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-muted text-xs font-semibold text-white shadow-md animate-pulse">...</span>
            ) : count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-feature-users text-xs font-semibold text-white shadow-md">
                    {count > 99 ? "99+" : count}
                </span>
            )}
            {/* <Button
                variant="ghost"
                className="relative flex items-center gap-2 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-feature-users/20"
                tabIndex={-1} // Prevent focus since parent handles navigation
            >
                
            </Button> */}
        </Link>
    );
} 