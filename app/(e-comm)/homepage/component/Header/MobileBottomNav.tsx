'use client';

import { useState, useEffect, useRef, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { pingAdminAction } from '@/app/pingAdminAction';
import { WishlistContext } from '@/providers/wishlist-provider';

import Image from 'next/image';
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import SearchBar from './SearchBar';
import CartButtonWithBadge from '../../../(cart-flow)/cart/cart-controller/CartButtonWithBadge';
import { FaWhatsapp, FaTag } from 'react-icons/fa';
import useSWR from 'swr';
import WishlistIconClient from './WishlistIconClient';

// Types
interface BottomNavItem {
    id: string;
    label: string;
    icon: string;
    href: string;
    badge?: number;
    color: string;
    userImage?: string | null;
    userName?: string;
}

interface MobileBottomNavProps {
    wishlistCount?: number;
    isLoggedIn?: boolean;
    userImage?: string | null;
    userName?: string | null;
    supportEnabled?: boolean;
    whatsappNumber?: string;
    userId?: string;
    onSearchClick?: () => void;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Navigation Item Component (80 lines)
function NavigationItem({
    item,
    isActive,
    onTabPress,
    onSearchClick,
    isLoggedIn
}: {
    item: BottomNavItem;
    isActive: boolean;
    onTabPress: (id: string) => void;
    onSearchClick?: () => void;
    isLoggedIn: boolean;
}) {
    // Always call useSWR, only use data for categories
    const { data } = useSWR(item.id === 'categories' ? '/api/categories' : null, fetcher);
    const categoryCount = item.id === 'categories' && data?.categories ? data.categories.length : 0;
    const content = (
        <>
            <div className="relative flex items-center justify-center h-7 w-7">
                {item.id === 'wishlist' ? (
                    <WishlistIconClient isLoggedIn={isLoggedIn} />
                ) : item.id === 'categories' ? (
                    <FaTag size={18} className={cn("transition-all duration-300", isActive ? `${item.color} scale-110` : "text-muted-foreground")} />
                ) : item.id === 'account' ? (
                    item.userImage && !item.userImage.includes('/fallback/') ? (
                        <div className={cn(
                            "relative h-6 w-6 rounded-full transition-all duration-300",
                            isActive
                                ? `ring-2 ring-offset-1 ${item.color.replace('text-', 'ring-')} ring-offset-background`
                                : "ring-1 ring-muted/50"
                        )}>
                            <Image
                                src={item.userImage}
                                alt="User Profile"
                                fill
                                className="rounded-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className={cn(
                            "h-6 w-6 rounded-full flex items-center justify-center bg-feature-users text-white font-bold text-xs select-none",
                            isActive
                                ? `ring-2 ring-offset-1 ${item.color.replace('text-', 'ring-')} ring-offset-background`
                                : "ring-1 ring-muted/50"
                        )}>
                            {item.userName && item.userName.length > 0 ? (
                                <span className="uppercase">{item.userName[0]}</span>
                            ) : (
                                <Icon name="User" size="sm" />
                            )}
                        </div>
                    )
                ) : (
                    <Icon name={item.icon} size="sm" className={cn(
                        "transition-all duration-300",
                        isActive ? `${item.color} scale-110` : "text-muted-foreground"
                    )} />
                )}
                {/* Remove manual wishlist badge here */}
                {item.id === 'categories' && categoryCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-feature-products text-white text-[10px] font-bold shadow ring-1 ring-white dark:ring-gray-900 border border-feature-products animate-in fade-in zoom-in">
                        {categoryCount > 99 ? '99+' : categoryCount}
                    </span>
                )}
            </div>
            {/* Remove label for wishlist, categories, and home */}
            {item.id !== 'wishlist' && item.id !== 'categories' && item.id !== 'home' && (
                <span className={cn(
                    "text-xs transition-colors duration-300",
                    isActive ? item.color : "text-muted-foreground"
                )}>
                    {item.label}
                </span>
            )}
        </>
    );

    if (item.id === 'search') {
        return (
            <button
                onClick={() => {
                    onTabPress(item.id);
                    onSearchClick?.();
                }}
                className={cn(
                    "flex flex-col items-center justify-center relative transition-all duration-300 w-full h-full pt-1",
                    "hover:bg-muted/50 active:bg-muted",
                    isActive ? "bg-muted/50" : ""
                )}
            >
                {content}
            </button>
        );
    }

    return (
        <Link
            href={item.href}
            onClick={() => onTabPress(item.id)}
            className={cn(
                "flex flex-col items-center justify-center relative transition-all duration-300 w-full h-full pt-1",
                "hover:bg-muted/50 active:bg-muted",
                isActive ? "bg-muted/50" : ""
            )}
        >
            {content}
        </Link>
    );
}

// Support Modal Component (49 lines)
function SupportModal({
    isOpen,
    onClose,
    supportMessage,
    setSupportMessage,
    supportLoading,
    supportStatus,
    onSubmit
}: {
    isOpen: boolean;
    onClose: () => void;
    supportMessage: string;
    setSupportMessage: (msg: string) => void;
    supportLoading: boolean;
    supportStatus: string;
    onSubmit: () => void;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex w-full max-w-xs flex-col gap-3 rounded-lg bg-background p-6 shadow-lg mx-4"
            >
                <h3 className="text-lg font-semibold text-foreground">وصف مشكلتك</h3>
                <p className="mb-1 text-xs text-muted-foreground">
                    <span className="mb-0.5 block">الغرض من هذه الخدمة: إرسال طلب دعم فوري للإدارة لحل مشكلة عاجلة أو استفسار هام.</span>
                    <span className="block">عدد الأحرف المسموح: من 5 إلى 200 حرف.</span>
                    <span className="block">يرجى استخدام هذه الخدمة فقط للمشاكل العاجلة أو الاستفسارات الهامة.</span>
                </p>
                <textarea
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    maxLength={200}
                    rows={3}
                    className="w-full resize-none rounded border border-border bg-background p-2 text-foreground placeholder:text-muted-foreground"
                    placeholder="كيف يمكننا مساعدتك؟"
                    autoFocus
                />
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={onClose} disabled={supportLoading}>إلغاء</Button>
                    <Button
                        size="sm"
                        onClick={onSubmit}
                        disabled={supportLoading || supportMessage.trim().length < 5}
                        className="bg-feature-settings hover:bg-feature-settings/90"
                    >
                        {supportLoading ? 'جارٍ الإرسال...' : 'إرسال'}
                    </Button>
                </div>
                {supportStatus === 'sent' && <p className="text-sm text-feature-products">تم إرسال الطلب بنجاح!</p>}
                {supportStatus === 'fallback' && <p className="text-sm text-feature-analytics">ستتم مراجعة طلبك قريباً (وضع الاحتياط).</p>}
                {supportStatus === 'rate-limited' && <p className="text-sm text-feature-settings">يرجى الانتظار قبل إرسال طلب آخر.</p>}
                {supportStatus === 'error' && <p className="text-sm text-destructive">فشل في إرسال الطلب. حاول مرة أخرى.</p>}
            </motion.div>
        </div>
    );
}

// Main Component (69 lines)
export default function MobileBottomNav({
    wishlistCount = 0,
    isLoggedIn = false,
    whatsappNumber,
    userId = 'guest',
    onSearchClick
}: MobileBottomNavProps) {
    const ctx = useContext(WishlistContext);
    const derivedWishlistCount = ctx ? ctx.wishlistIds.size : wishlistCount;

    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState('home');
    const [supportStatus, setSupportStatus] = useState<'idle' | 'sent' | 'error' | 'fallback' | 'rate-limited'>('idle');
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [supportMessage, setSupportMessage] = useState('');
    const [supportLoading, setSupportLoading] = useState(false);
    const [supportCooldown, setSupportCooldown] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);

    const COOLDOWN_SECONDS = 180;
    const LAST_PING_KEY = 'support_ping_last_time';

    const navItems: BottomNavItem[] = [
        { id: 'bestsellers', label: '', icon: 'FaFireFlameCurved', href: '/bestsellers', color: 'text-feature-analytics' },
        { id: 'categories', label: 'الأقسام', icon: 'Grid3X3', href: '/categories', color: 'text-feature-products' },
        // Cart will be handled by CartButtonWithBadge
        { id: 'wishlist', label: 'المفضلة', icon: 'Heart', href: '/user/wishlist', badge: derivedWishlistCount, color: 'text-feature-users' },
        { id: 'whatsapp', label: 'واتساب', icon: 'Whatsapp', href: `https://wa.me/${whatsappNumber?.replace(/\D/g, '')}?text=مرحباً، أحتاج مساعدة في التسوق`, color: 'text-feature-suppliers' },
    ];

    // Active tab handling
    useEffect(() => {
        if (pathname.startsWith('/bestsellers')) setActiveTab('bestsellers');
        else if (pathname.startsWith('/categories')) setActiveTab('categories');
        else if (pathname.startsWith('/cart')) setActiveTab('cart');
        else if (pathname.startsWith('/wishlist')) setActiveTab('wishlist');
        else if (pathname.startsWith('/user') || pathname.startsWith('/auth')) setActiveTab('account');
    }, [pathname]);

    // Support cooldown
    useEffect(() => {
        const lastPing = localStorage.getItem(LAST_PING_KEY);
        if (lastPing) {
            const elapsed = Math.floor((Date.now() - parseInt(lastPing, 10)) / 1000);
            if (elapsed < COOLDOWN_SECONDS) setSupportCooldown(COOLDOWN_SECONDS - elapsed);
        }
    }, [COOLDOWN_SECONDS, LAST_PING_KEY]);

    useEffect(() => {
        if (supportCooldown > 0) {
            timerRef.current = setInterval(() => {
                setSupportCooldown((prev) => prev <= 1 ? 0 : prev - 1);
                if (supportCooldown <= 1) clearInterval(timerRef.current!);
            }, 1000);
            return () => clearInterval(timerRef.current!);
        }
    }, [supportCooldown]);

    const handleTabPress = (tabId: string) => {
        setActiveTab(tabId);
        if (tabId === 'search') setSearchDrawerOpen(true);
        if ('vibrate' in navigator) navigator.vibrate(50);
    };

    const handleSupportPing = async () => {
        setSupportLoading(true);
        const res = await pingAdminAction(userId, supportMessage);
        setSupportLoading(false);

        if (res.success) setSupportStatus('sent');
        else if (res.fallback) setSupportStatus('fallback');
        else if (res.rateLimited) setSupportStatus('rate-limited');
        else setSupportStatus('error');

        if (res.success || res.fallback || res.rateLimited) {
            setSupportCooldown(COOLDOWN_SECONDS);
            localStorage.setItem(LAST_PING_KEY, Date.now().toString());
        }

        setShowSupportModal(false);
        setSupportMessage('');
    };

    return (
        <>
            <Drawer open={searchDrawerOpen} onOpenChange={setSearchDrawerOpen}>
                <DrawerTrigger asChild>
                    <button style={{ display: 'none' }} aria-label="Open search drawer (hidden trigger)" />
                </DrawerTrigger>
                <DrawerContent className="max-w-xl mx-auto p-4">
                    <DrawerTitle className="sr-only">بحث المنتجات</DrawerTitle>
                    <SearchBar />
                </DrawerContent>
            </Drawer>
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg md:hidden overflow-hidden"
            >
                <div className="grid grid-cols-5 h-16 w-full">
                    <div className="relative">
                        <NavigationItem
                            item={navItems[0]}
                            isActive={activeTab === navItems[0].id}
                            onTabPress={handleTabPress}
                            onSearchClick={onSearchClick}
                            isLoggedIn={isLoggedIn}
                        />
                    </div>
                    <div className="relative">
                        <NavigationItem
                            item={navItems[1]}
                            isActive={activeTab === navItems[1].id}
                            onTabPress={handleTabPress}
                            onSearchClick={onSearchClick}
                            isLoggedIn={isLoggedIn}
                        />
                    </div>
                    <div className="relative flex items-center justify-center">
                        <CartButtonWithBadge />
                    </div>
                    <div className="relative">
                        <NavigationItem
                            item={navItems[2]}
                            isActive={activeTab === navItems[2].id}
                            onTabPress={handleTabPress}
                            onSearchClick={onSearchClick}
                            isLoggedIn={isLoggedIn}
                        />
                    </div>
                    <div className="relative">
                        <a
                            href={navItems[3].href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "flex flex-col items-center justify-center relative transition-all duration-300 w-full h-full pt-1",
                                "hover:bg-muted/50 active:bg-muted",
                                activeTab === navItems[3].id ? navItems[3].color : "text-muted-foreground"
                            )}
                        >
                            <FaWhatsapp size={22} color="#25D366" className="mb-0.5" />
                        </a>
                    </div>
                </div>
            </motion.div>
            {/* Removed QuickActionButtons */}

            <SupportModal
                isOpen={showSupportModal}
                onClose={() => setShowSupportModal(false)}
                supportMessage={supportMessage}
                setSupportMessage={setSupportMessage}
                supportLoading={supportLoading}
                supportStatus={supportStatus}
                onSubmit={handleSupportPing}
            />
        </>
    );
} 