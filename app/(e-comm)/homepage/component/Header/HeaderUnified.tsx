"use client";
import { useMemo } from 'react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import UserMenuTrigger from './UserMenuTrigger';
import CartIconClient from '../../../(cart-flow)/cart/cart-controller/CartButtonWithBadge';
import WishlistIconClient from './WishlistIconClient';
import NotificationBell from './NotificationBell';
import { useMediaQuery } from '@/hooks/use-media-query';
import { UserRole } from '@/constant/enums';
import Link from '@/components/link';

interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: UserRole;
}

interface HeaderUnifiedProps {
    logo: string;
    logoAlt?: string;
    user: User | null;
    unreadCount?: number;
    defaultAlerts?: any[];
    isLoggedIn?: boolean;
}

function UserMenuOrLogin({ isLoggedIn, user }: { isLoggedIn: boolean; user: User | null }) {
    return isLoggedIn ? (
        <UserMenuTrigger user={user} />
    ) : (
        <Link href="/auth/login" className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">تسجيل الدخول</Link>
    );
}

function DesktopHeader({ logo, logoAlt, isLoggedIn, user, totalCount }: {
    logo: string;
    logoAlt: string;
    isLoggedIn: boolean;
    user: User | null;
    totalCount: number;
}) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border/60 shadow-2xl shadow-black/20 dark:shadow-white/10 transition-all duration-300">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <span className="flex items-center">
                    <Logo logo={logo} logoAlt={logoAlt} />
                </span>
                <div className="flex items-center gap-4 md:gap-6">
                    <SearchBar />
                    <WishlistIconClient isLoggedIn={isLoggedIn} />
                    <CartIconClient />
                    <NotificationBell isLoggedIn={isLoggedIn} count={totalCount} showNumber={true} />
                    <UserMenuOrLogin isLoggedIn={isLoggedIn} user={user} />
                </div>
            </nav>
        </header>
    );
}

function MobileHeader({ logo, logoAlt, isLoggedIn, user, totalCount }: {
    logo: string;
    logoAlt: string;
    isLoggedIn: boolean;
    user: User | null;
    totalCount: number;
}) {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 flex h-14 md:h-20 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6 shadow-2xl shadow-black/20 dark:shadow-white/10 ">
            <div className=" flex justify-center">
                <Logo logo={logo} logoAlt={logoAlt} />
            </div>
            <div className="flex items-center gap-2">
                <SearchBar />
                <NotificationBell isLoggedIn={isLoggedIn} count={totalCount} showNumber={true} />
                <UserMenuOrLogin isLoggedIn={isLoggedIn} user={user} />
            </div>
        </header>
    );
}

export default function HeaderUnified({
    user,
    logo,
    logoAlt = 'Logo',
    unreadCount = 0,
    defaultAlerts = [],
    isLoggedIn = false,
}: HeaderUnifiedProps) {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const totalCount = useMemo(() => (unreadCount || 0) + (defaultAlerts?.length || 0), [unreadCount, defaultAlerts]);

    return isDesktop ? (
        <DesktopHeader
            logo={logo}
            logoAlt={logoAlt}
            isLoggedIn={isLoggedIn}
            user={user}
            totalCount={totalCount}
        />
    ) : (
        <MobileHeader
            logo={logo}
            logoAlt={logoAlt}
            isLoggedIn={isLoggedIn}
            user={user}
            totalCount={totalCount}
        />
    );
} 