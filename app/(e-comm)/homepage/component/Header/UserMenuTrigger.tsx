"use client";

import Link from '@/components/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/constant/enums';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { signOut } from 'next-auth/react';
import { Icon } from '@/components/icons/Icon';

interface UserMenuTriggerProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: UserRole;
    } | null;
    alerts?: any[];
}

interface UserStats {
    totalOrders: number;
    totalSpent: number;
    loyaltyPoints: number;
    memberSince: string;
    wishlistCount: number;
    reviewsCount: number;
}

export default function UserMenuTrigger({ user, alerts }: UserMenuTriggerProps) {
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [hasFetched, setHasFetched] = useState(false); // Simple caching
    const name = user?.name;
    const image = user?.image;

    // User-specific navigation items only (removed universal navigation)
    const userNavItems = user ? [
        {
            href: `/user/profile?id=${user.id ?? ''}`,
            label: "الملف الشخصي",
            icon: "User",
            description: "إدارة معلوماتك الشخصية"
        },
        {
            href: `/user/purchase-history`,
            label: "طلباتي",
            icon: "ShoppingBag",
            description: "تصفح مشترياتك",
            badge: userStats?.totalOrders && userStats.totalOrders > 0 ? userStats.totalOrders.toString() : undefined
        },
        {
            href: `/user/wishlist/${user.id ?? ''}`,
            label: "المفضلة",
            icon: "Heart",
            description: "المنتجات المحفوظة",
            badge: userStats?.wishlistCount && userStats?.wishlistCount > 0 ? userStats.wishlistCount.toString() : undefined
        },
        {
            href: `/user/statement/${user.id ?? ''}`,
            label: "الحركات المالية",
            icon: "CreditCard",
            description: "تاريخ المعاملات"
        },
        {
            href: `/user/ratings`,
            label: "تقييماتي",
            icon: "Star",
            description: "إدارة التقييمات",
            badge: userStats?.reviewsCount && userStats.reviewsCount > 0 ? userStats.reviewsCount.toString() : undefined
        },
        {
            href: `/user/notifications`,
            label: "الإشعارات",
            icon: "Bell",
            description: "إدارة التنبيهات"
        }
    ] : [];

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut({
                callbackUrl: '/',
                redirect: true
            });
        } catch (error) {
            console.error('خطأ في تسجيل الخروج:', error);
            setIsLoggingOut(false);
        }
    };

    const loadUserStats = async () => {
        // Simple caching: only fetch once
        if (!userStats && !isLoading && !hasFetched) {
            setIsLoading(true);
            try {
                const res = await fetch('/api/user/stats');
                const data = await res.json();
                setUserStats(data);
                setHasFetched(true); // Mark as fetched
            } catch (error) {
                console.error('Error loading user stats:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (!user) {
        return (
            <Button asChild size="sm" className="h-8 px-3 text-sm font-medium">
                <Link href="/auth/login">
                    <Icon name="User" className="w-4 h-4 mr-2" />
                    تسجيل الدخول
                </Link>
            </Button>
        );
    }

    return (
        <DropdownMenu onOpenChange={(open) => {
            if (open) {
                loadUserStats();
            }
        }}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-accent transition-colors duration-200"
                >
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-border/50">
                        <AvatarImage
                            src={image || "/fallback/fallback.avif"}
                            alt={name || "User"}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                            {name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    {alerts && alerts.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-background animate-pulse" />
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-80 p-0 bg-background/95 backdrop-blur-md border border-border/50 shadow-xl"
                sideOffset={8}
            >
                {/* User Info Header */}
                <div className="p-4 border-b border-border/30 bg-muted/30">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-border">
                            <AvatarImage
                                src={image || "/fallback/fallback.avif"}
                                alt={name || "User"}
                                className="object-cover"
                            />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {name?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <DropdownMenuLabel className="text-base font-semibold text-foreground p-0 truncate">
                                {name || "المستخدم"}
                            </DropdownMenuLabel>
                            <p className="text-sm text-muted-foreground truncate">
                                {user.email || "حساب شخصي"}
                            </p>
                            {userStats && (
                                <p className="text-xs text-muted-foreground/70 mt-1">
                                    عضو منذ {userStats.memberSince}
                                </p>
                            )}
                        </div>
                        {isLoading && (
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        )}
                    </div>

                    {/* Quick Stats */}
                    {userStats && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="text-center p-2 rounded-lg bg-background/50">
                                <div className="text-sm font-semibold text-foreground">
                                    {userStats.totalOrders}
                                </div>
                                <div className="text-xs text-muted-foreground">طلبات</div>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-background/50">
                                <div className="text-sm font-semibold text-foreground">
                                    {userStats.wishlistCount}
                                </div>
                                <div className="text-xs text-muted-foreground">مفضلة</div>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-background/50">
                                <div className="text-sm font-semibold text-foreground">
                                    {userStats.reviewsCount}
                                </div>
                                <div className="text-xs text-muted-foreground">تقييم</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Items */}
                <div className="p-2">
                    {userNavItems.map((item, index) => (
                        <DropdownMenuItem key={index} asChild className="p-0">
                            <Link
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors duration-200 cursor-pointer"
                            >
                                <div className="p-1.5 rounded-md bg-muted/50">
                                    <Icon name={item.icon} className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm text-foreground truncate">
                                        {item.label}
                                    </div>
                                    <div className="text-xs text-muted-foreground/70 truncate">
                                        {item.description}
                                    </div>
                                </div>
                                {item.badge && (
                                    <Badge variant="secondary" className="text-xs h-5 px-1.5">
                                        {item.badge}
                                    </Badge>
                                )}
                                <Icon name="ChevronLeft" className="w-3 h-3 text-muted-foreground/50" />
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </div>

                <DropdownMenuSeparator />

                {/* Logout */}
                <div className="p-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                                onSelect={(e) => e.preventDefault()}
                            >
                                <div className="p-1.5 rounded-md bg-destructive/10">
                                    <Icon name="LogOut" className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-sm">تسجيل الخروج</div>
                                    <div className="text-xs opacity-70">إنهاء الجلسة</div>
                                </div>
                                <Icon name="ChevronLeft" className="w-3 h-3 opacity-50" />
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-md">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-right flex items-center gap-2">
                                    <Icon name="LogOut" className="w-5 h-5 text-destructive" />
                                    تأكيد تسجيل الخروج
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-right">
                                    هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-2">
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                                            جاري الخروج...
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="LogOut" className="w-4 h-4 ml-2" />
                                            تسجيل الخروج
                                        </>
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 