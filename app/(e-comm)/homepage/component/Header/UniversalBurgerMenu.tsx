"use client";

import { useState } from 'react';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Icon } from '@/components/icons/Icon';

interface UniversalNavItem {
    href: string;
    label: string;
    icon: string;
    description?: string;
}

// Universal Navigation Items - NO AUTH CHECKS - Available for ALL users
const universalNavItems: UniversalNavItem[] = [
    // Main Shopping
    {
        href: "/",
        label: "الرئيسية",
        icon: "Home",
        description: "العودة للصفحة الرئيسية"
    },
    {
        href: "/categories",
        label: "التصنيفات",
        icon: "Grid3x3",
        description: "تصفح جميع الفئات"
    },
    {
        href: "/bestsellers",
        label: "الأكثر مبيعاً",
        icon: "TrendingUp",
        description: "المنتجات الأكثر طلباً"
    },
    {
        href: "/#offers",
        label: "العروض",
        icon: "Tag",
        description: "أحدث العروض والخصومات"
    },

    // Support & Info
    {
        href: "/contact",
        label: "اتصل بنا",
        icon: "Phone",
        description: "تواصل مع فريق الدعم"
    },
    {
        href: "/about",
        label: "حول الموقع",
        icon: "Info",
        description: "معلومات عن شركتنا"
    },
    {
        href: "/privacy",
        label: "سياسة الخصوصية",
        icon: "Shield",
        description: "شروط الاستخدام والخصوصية"
    }
];

export default function UniversalBurgerMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 text-foreground border-border/60 hover:bg-accent hover:text-primary hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md shrink-0"
                    aria-label="فتح القائمة الرئيسية"
                >
                    <Icon name="Menu" className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-80 sm:w-96 overflow-y-auto"
                dir="rtl"
            >
                <SheetHeader className="text-right mb-6">
                    <SheetTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Icon name="Menu" className="h-6 w-6 text-primary" />
                        القائمة الرئيسية
                    </SheetTitle>
                </SheetHeader>

                {/* Navigation Items */}
                <div className="space-y-2">
                    {universalNavItems.map((item, index) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 border border-border bg-card hover:bg-accent hover:shadow-md hover:border-accent-foreground/20 hover:-translate-y-0.5"
                            onClick={() => setIsOpen(false)}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="p-2 rounded-lg bg-muted group-hover:bg-background transition-colors duration-300">
                                <Icon name={item.icon} className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <div className="flex-1 text-right">
                                <div className="font-medium text-foreground group-hover:text-accent-foreground transition-colors duration-300">
                                    {item.label}
                                </div>
                                {item.description && (
                                    <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
                                        {item.description}
                                    </div>
                                )}
                            </div>
                            <Icon
                                name="ChevronLeft"
                                className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300"
                            />
                        </Link>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-border">
                    <div className="text-center text-sm text-muted-foreground">
                        <p className="flex items-center justify-center gap-2">
                            <Icon name="Heart" className="w-4 h-4 text-red-500" />
                            صُنع بحب في
                            <Link
                                href="https://dreamto.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                dreamto.app
                            </Link>
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
} 