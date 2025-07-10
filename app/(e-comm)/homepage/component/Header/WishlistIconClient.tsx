"use client";
import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { WishlistContext } from "@/providers/wishlist-provider";
import { Icon } from '@/components/icons/Icon';
import LoginPromptModal from './LoginPromptModal';

export default function WishlistIconClient({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
    const ctx = useContext(WishlistContext);
    const count = ctx ? ctx.wishlistIds.size : 0;
    const [showPrompt, setShowPrompt] = useState(false);

    if (!isLoggedIn) {
        return (
            <>
                <div className="w-12 h-12 flex items-center justify-center p-2 relative">
                    <Button
                        variant="ghost"
                        className="relative flex items-center gap-2 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-feature-users/20"
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
        <div className="w-12 h-12 flex items-center justify-center p-2 relative">
            <Button
                variant="ghost"
                className="relative flex items-center gap-2 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-feature-users/20"
                tabIndex={-1} // Prevent focus since parent handles navigation
            >
                <Icon name="Heart" className="h-7 w-7 text-foreground" />
                {count > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-feature-users text-xs font-semibold text-white shadow-md">
                        {count > 99 ? "99+" : count}
                    </span>
                )}
            </Button>
        </div>
    );
} 