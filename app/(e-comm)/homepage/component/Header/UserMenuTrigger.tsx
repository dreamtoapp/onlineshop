"use client";

import Link from '@/components/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/constant/enums';
import { useState, useEffect } from 'react';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
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
    isMobile?: boolean;
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

export default function UserMenuTrigger({ user, isMobile, alerts }: UserMenuTriggerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const name = user?.name;
    const image = user?.image;

    // Move navLinks and statsCards above all returns/usages
    const navLinks = user ? [
        {
            href: `/user/profile?id=${user.id ?? ''}`,
            label: "الملف الشخصي",
            icon: <Icon name="User" className="w-5 h-5" />,
            description: "إدارة معلوماتك الشخصية",
            category: "account"
        },
        {
            href: `/user/purchase-history`,
            label: "سجل المشتريات",
            icon: <Icon name="ShoppingBag" className="w-5 h-5" />,
            description: "تصفح مشترياتك وطلباتك",
            badge: userStats?.totalOrders && userStats.totalOrders > 0 ? userStats.totalOrders.toString() : undefined,
            category: "commerce"
        },
        {
            href: `/user/statement?id=${user.id ?? ''}`,
            label: "الحركات المالية",
            icon: <Icon name="CreditCard" className="w-5 h-5" />,
            description: "عرض تاريخ المعاملات",
            category: "finance"
        },
        {
            href: `/user/ratings`,
            label: "تقييماتي ومراجعاتي",
            icon: <Icon name="Star" className="w-5 h-5" />,
            description: "إدارة تقييماتك وآرائك",
            badge: userStats?.reviewsCount && userStats.reviewsCount > 0 ? userStats.reviewsCount.toString() : undefined,
            category: "social"
        },
        {
            href: `/user/wishlist/${user.id ?? ''}`,
            label: "قائمة المفضلة",
            icon: <Icon name="Heart" className="w-5 h-5" />,
            description: "المنتجات التي أعجبتك",
            badge: userStats?.wishlistCount && userStats?.wishlistCount > 0 ? userStats.wishlistCount.toString() : undefined,
            category: "social"
        },
        {
            href: `/user/notifications`,
            label: "الإشعارات",
            icon: <Icon name="Bell" className="w-5 h-5" />,
            description: "إدارة إشعاراتك وتنبيهاتك",
            badge: "جديد",
            category: "system"
        },
        {
            href: `/contact`,
            label: "اتصل بنا",
            icon: <Icon name="Phone" className="w-5 h-5" />,
            description: "تواصل مع فريق الدعم",
            category: "support"
        },
        {
            href: `/about`,
            label: "حول الموقع",
            icon: <Icon name="Award" className="w-5 h-5" />,
            description: "معلومات عن موقعنا وخدماتنا",
            category: "support"
        },
    ] : [];

    const statsCards = userStats ? [
        {
            label: "الطلبات",
            value: userStats.totalOrders,
            icon: <Icon name="ShoppingBag" className="w-4 h-4" />,
            color: "text-feature-commerce",
            bgColor: "bg-feature-commerce/10",
            borderColor: "border-feature-commerce/20"
        },
        {
            label: "المفضلة",
            value: userStats.wishlistCount,
            icon: <Icon name="Heart" className="w-4 h-4" />,
            color: "text-feature-products",
            bgColor: "bg-feature-products/10",
            borderColor: "border-feature-products/20"
        },
        {
            label: "النقاط",
            value: userStats.loyaltyPoints,
            icon: <Icon name="Gift" className="w-4 h-4" />,
            color: "text-feature-suppliers",
            bgColor: "bg-feature-suppliers/10",
            borderColor: "border-feature-suppliers/20"
        },
        {
            label: "التقييمات",
            value: userStats.reviewsCount,
            icon: <Icon name="Star" className="w-4 h-4" />,
            color: "text-feature-analytics",
            bgColor: "bg-feature-analytics/10",
            borderColor: "border-feature-analytics/20"
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

    useEffect(() => {
        if (user && isOpen && !userStats && !isLoading) {
            setIsLoading(true);
            fetch('/api/user/stats')
                .then(res => res.json())
                .then(data => {
                    setUserStats(data);
                    setIsLoading(false);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }
    }, [user, isOpen, userStats, isLoading]);

    if (!user) {
        return (
            <Button asChild className="btn-add h-8 px-4 py-2 text-sm rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300">
                <Link href="/auth/login">
                    <Icon name="User" className="w-4 h-4 mr-2" />
                    تسجيل الدخول
                </Link>
            </Button>
        );
    }

    if (user) {
        return (
            <>

                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        {isMobile ? (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative p-1 hover:bg-accent/50 transition-colors duration-200 rounded-lg"
                            >
                                <Avatar className="h-8 w-8 border-2 border-border shadow-sm bg-background">
                                    <AvatarImage
                                        src={image || "/fallback/fallback.avif"}
                                        alt={name || "User"}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="bg-feature-users/10 text-feature-users font-bold text-sm">
                                        {name?.[0]?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                {alerts && alerts.length > 0 && (
                                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-feature-products rounded-full animate-pulse border-2 border-background" />
                                )}
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                className="group relative p-1 hover:bg-transparent focus:outline-none"
                            >
                                <div className="relative">
                                    <Avatar className="h-9 w-9 border-2 border-border shadow-md bg-background group-hover:border-feature-users/50 transition-all duration-300 group-hover:shadow-lg">
                                        <AvatarImage
                                            src={image || "/fallback/fallback.avif"}
                                            alt={name || "User"}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-feature-users/10 text-feature-users font-bold text-sm">
                                            {name?.[0]?.toUpperCase() || "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                    {alerts && alerts.length > 0 && (
                                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-feature-products rounded-full border-2 border-background animate-pulse" />
                                    )}
                                    <div className="absolute inset-0 rounded-full bg-feature-users/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                                </div>
                            </Button>
                        )}
                    </SheetTrigger>

                    <SheetContent
                        side={isMobile ? "bottom" : "right"}
                        className={`overflow-y-auto border-0 shadow-2xl ${isMobile ? 'h-[90vh] rounded-t-2xl' : 'w-[400px]'}`}
                    >
                        {/* Enhanced Header with Gradient */}
                        <div className={`relative p-6 mb-6 ${isMobile ? 'bg-gradient-to-br from-feature-users via-feature-users/90 to-feature-analytics text-white rounded-t-2xl' : 'bg-gradient-to-br from-feature-users/5 via-feature-users/10 to-feature-analytics/5 border-b border-border/50'} overflow-hidden`}>
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-4 right-4 w-32 h-32 rounded-full border border-current/20"></div>
                                <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full border border-current/20"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-current/10"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`p-3 rounded-2xl ${isMobile ? 'bg-white/20 backdrop-blur-sm border border-white/30' : 'bg-feature-users/10 border border-feature-users/20'}`}>
                                        <Icon name="User" className={`w-6 h-6 ${isMobile ? 'text-white' : 'text-feature-users'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <SheetTitle className={`text-2xl font-bold ${isMobile ? 'text-white' : 'text-foreground'} flex items-center gap-2`}>
                                            مرحباً {name}
                                            <Icon name="Sparkles" className={`w-5 h-5 ${isMobile ? 'text-yellow-300' : 'text-feature-suppliers'} animate-pulse`} />
                                        </SheetTitle>
                                        <SheetDescription className={`${isMobile ? 'text-white/80' : 'text-muted-foreground'} font-medium`}>
                                            مركز إدارة الحساب الشخصي
                                        </SheetDescription>
                                    </div>
                                </div>

                                {/* Enhanced Stats Grid */}
                                {isLoading ? (
                                    <div className={`animate-pulse ${isMobile ? 'text-white/80' : 'text-muted-foreground'} text-center py-4`}>
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                                        </div>
                                        <p className="mt-2">جاري تحميل البيانات...</p>
                                    </div>
                                ) : userStats ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {statsCards.map((stat, index) => (
                                            <div
                                                key={stat.label}
                                                className={`p-3 rounded-xl ${isMobile ? 'bg-white/15 backdrop-blur-sm border border-white/20' : `${stat.bgColor} border ${stat.borderColor}`} hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md group cursor-pointer`}
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className={`p-1 rounded-lg ${isMobile ? 'bg-white/20' : stat.bgColor} ${isMobile ? 'text-white' : stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                                        {stat.icon}
                                                    </div>
                                                    <span className={`text-xs ${isMobile ? 'text-white/80' : 'text-muted-foreground'} font-medium`}>
                                                        {stat.label}
                                                    </span>
                                                </div>
                                                <div className={`text-xl font-bold ${isMobile ? 'text-white' : stat.color} group-hover:scale-105 transition-transform duration-300`}>
                                                    {stat.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {/* Enhanced Navigation Links */}
                        <div className="px-6 space-y-2">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <Icon name="Settings" className="w-5 h-5 text-feature-settings" />
                                الخدمات والإعدادات
                            </h3>

                            {navLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 border border-border bg-card hover:bg-accent hover:shadow-md hover:border-accent-foreground/20 hover:-translate-y-0.5"
                                    onClick={() => setIsOpen(false)}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="p-2 rounded-lg bg-muted group-hover:bg-background transition-colors duration-300">
                                        {link.icon}
                                    </div>
                                    <div className="flex-1 text-right">
                                        <div className="font-medium text-foreground group-hover:text-accent-foreground transition-colors duration-300">
                                            {link.label}
                                        </div>
                                        <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
                                            {link.description}
                                        </div>
                                    </div>
                                    {link.badge && (
                                        <Badge variant="secondary" className="ml-2 bg-feature-suppliers/10 text-feature-suppliers border-feature-suppliers/20 group-hover:scale-105 transition-transform duration-300">
                                            {link.badge}
                                        </Badge>
                                    )}
                                    <Icon name="ChevronRight" className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground group-hover:translate-x-1 transition-all duration-300" />
                                </Link>
                            ))}
                        </div>

                        {/* Logout Section */}
                        <div className="px-6 mt-6 pt-6 border-t border-border">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-4 p-4 text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/20 hover:border-destructive/30 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                                        disabled={isLoggingOut}
                                    >
                                        <div className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors duration-300">
                                            <Icon name="LogOut" className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 text-right">
                                            <div className="font-medium">تسجيل الخروج</div>
                                            <div className="text-xs opacity-70">إنهاء الجلسة الحالية</div>
                                        </div>
                                        <Icon name="ChevronRight" className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-md">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-right flex items-center gap-2">
                                            <Icon name="LogOut" className="w-5 h-5 text-destructive" />
                                            تأكيد تسجيل الخروج
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-right">
                                            هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟
                                            <br />
                                            <span className="text-muted-foreground text-sm">ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حسابك.</span>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="gap-2">
                                        <AlertDialogCancel className="btn-cancel-outline">
                                            إلغاء
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleLogout}
                                            disabled={isLoggingOut}
                                            className="btn-delete"
                                        >
                                            {isLoggingOut ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                                                    جاري تسجيل الخروج...
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

                        {/* Footer with Member Info */}
                        {userStats && (
                            <div className="px-6 mt-4 pb-6">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-feature-users/5 border border-feature-users/20">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-feature-users/10">
                                            <Icon name="Calendar" className="w-4 h-4 text-feature-users" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-foreground">عضو منذ</div>
                                            <div className="text-xs text-muted-foreground">{userStats.memberSince}</div>
                                        </div>
                                    </div>
                                    <Icon name="ArrowUpRight" className="w-4 h-4 text-feature-users" />
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>
            </>
        );
    }
} 