"use client";
import Logo from './Logo';
import SearchBar from './SearchBar';
import UserMenuTrigger from './UserMenuTrigger';
import CartIconClient from '../../../(cart-flow)/cart/cart-controller/CartButtonWithBadge';
import { useMediaQuery } from '@/hooks/use-media-query';
import { UserRole } from '@/constant/enums';
import Link from '@/components/link';
import { ReactNode } from 'react';
import { CarFront, Focus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

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
    isLoggedIn?: boolean;
    notificationBell?: ReactNode;
}

function UserMenuOrLogin({ isLoggedIn, user }: { isLoggedIn: boolean; user: User | null }) {
    return isLoggedIn ? (
        <UserMenuTrigger user={user} />
    ) : (
        <Link href="/auth/login" className={buttonVariants({ variant: "default", size: "sm" })}>تسجيل الدخول</Link>
    );
}

function DesktopHeader({ logo, logoAlt, isLoggedIn, user, notificationBell, wishlistIcon }: {
    logo: string;
    logoAlt: string;
    isLoggedIn: boolean;
    user: User | null;
    notificationBell?: ReactNode;
    wishlistIcon?: ReactNode;
}) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border/60 shadow-2xl shadow-black/20 dark:shadow-white/10 transition-all duration-300">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <span className="flex items-center">
                    <Logo logo={logo} logoAlt={logoAlt} />
                </span>


                <div className="flex items-center gap-4 md:gap-6 bg-secondary rounded-lg px-4">
                    {user?.role === UserRole.ADMIN && <Link href="/dashboard" className="px-3 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-primary/90 transition-colors"><Focus /></Link>}
                    {user?.role === UserRole.DRIVER && <Link href="/driver" className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"><CarFront /></Link>}

                    <SearchBar />
                    {wishlistIcon}
                    <CartIconClient />
                    {notificationBell}
                    <UserMenuOrLogin isLoggedIn={isLoggedIn} user={user} />
                </div>
            </nav>
        </header>
    );
}

function MobileHeader({ logo, logoAlt, isLoggedIn, user, notificationBell }: {
    logo: string;
    logoAlt: string;
    isLoggedIn: boolean;
    user: User | null;
    notificationBell?: ReactNode;
}) {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 flex h-14 md:h-20 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6 shadow-2xl shadow-black/20 dark:shadow-white/10 ">
            <div className=" flex justify-center">
                <Logo logo={logo} logoAlt={logoAlt} />
            </div>
            <div className="flex items-center gap-2 bg-secondary rounded-lg px-4">
                {user?.role === UserRole.ADMIN && <Link href="/dashboard" className="px-3 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-primary/90 transition-colors"><Focus /></Link>}
                {user?.role === UserRole.DRIVER && <Link href="/driver" className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"><CarFront /></Link>}
                <SearchBar />
                {notificationBell}
                <UserMenuOrLogin isLoggedIn={isLoggedIn} user={user} />
            </div>
        </header>
    );
}

export default function HeaderUnified({
    user,
    logo,
    logoAlt = 'Logo',
    isLoggedIn = false,
    notificationBell,
    wishlistIcon,
}: HeaderUnifiedProps & { wishlistIcon?: ReactNode }) {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    return isDesktop ? (
        <DesktopHeader
            logo={logo}
            logoAlt={logoAlt}
            isLoggedIn={isLoggedIn}
            user={user}
            notificationBell={notificationBell}
            wishlistIcon={wishlistIcon}
        />
    ) : (
        <MobileHeader
            logo={logo}
            logoAlt={logoAlt}
            isLoggedIn={isLoggedIn}
            user={user}
            notificationBell={notificationBell}
        />
    );
} 