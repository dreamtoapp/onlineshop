'use client';

import { Users, Package, BarChart3, Zap, ClipboardList, Truck } from 'lucide-react';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const quickActions = [
    {
        id: 'products',
        title: 'إدارة المنتجات',
        href: '/dashboard/management-products',
        icon: Package,
        color: 'text-green-600',
    },
    {
        id: 'orders',
        title: 'إدارة الطلبات',
        href: '/dashboard/management-orders',
        icon: ClipboardList,
        color: 'text-blue-600',
    },
    {
        id: 'reports',
        title: 'التقارير',
        href: '/dashboard/management-reports',
        icon: BarChart3,
        color: 'text-purple-600',
    },
    {
        id: 'customers',
        title: 'إدارة العملاء',
        href: '/dashboard/management-users/customer',
        icon: Users,
        color: 'text-orange-600',
    },
    {
        id: 'track-driver',
        title: 'تتبع السائق',
        href: '/dashboard/management-tracking',
        icon: Truck,
        color: 'text-red-600',
    },
];

export default function QuickActions() {
    return (
        <div className="flex items-center gap-2">
            {/* Quick Actions Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="hover:bg-feature-analytics-soft hover:border-feature-analytics transition-colors duration-200">
                        <Zap className="h-4 w-4 text-blue-600 icon-enhanced" />
                        <span className="hidden md:inline mr-1">إجراءات سريعة</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-2">
                    <DropdownMenuLabel className="text-base font-bold mb-2">
                        الإجراءات السريعة
                    </DropdownMenuLabel>

                    <div className="grid grid-cols-2 gap-2">
                        {quickActions.map((action) => (
                            <Link key={action.id} href={action.href}>
                                <Card className="cursor-pointer card-hover-effect">
                                    <CardContent className="p-3">
                                        <div className="flex items-center gap-2">
                                            <action.icon className={`h-4 w-4 ${action.color} icon-enhanced`} />
                                            <span className="text-sm font-semibold">{action.title}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
} 