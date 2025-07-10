'use client';

import { useState, useTransition } from 'react';
import { Icon } from '@/components/icons/Icon';
import Link from 'next/link';
import { getUserAlerts } from '@/app/(e-comm)/actions/getUserAlerts';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

type Alert = {
    id: string;
    type: 'warning' | 'destructive' | 'info' | 'success' | 'order' | 'promo' | 'system';
    title: string;
    description: string;
    href: string;
};

interface NotificationDropdownProps {
    userId: string;
    defaultAlerts?: Alert[]; // system alerts passed from parent (optional)
    children: React.ReactNode;
}

const iconMap = {
    warning: 'AlertTriangle',
    destructive: 'ShieldAlert',
    info: 'Info',
    success: 'CheckCircle2',
    order: 'Truck',
    promo: 'Gift',
    system: 'Server',
};

const colorMap = {
    warning: 'text-yellow-500',
    destructive: 'text-red-500',
    info: 'text-blue-500',
    success: 'text-green-500',
    order: 'text-feature-commerce',
    promo: 'text-pink-500',
    system: 'text-slate-500',
};

const fallbackIcon = 'Info';
const fallbackColor = 'text-muted-foreground';

export function NotificationDropdown({
    userId,
    defaultAlerts = [],
    children,
}: NotificationDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [alerts, setAlerts] = useState<Alert[]>(defaultAlerts);
    const [isPending, startTransition] = useTransition();

    const hasAlerts = alerts.length > 0;

    // fetch when opening for the first time
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open && alerts.length === defaultAlerts.length) {
            startTransition(async () => {
                try {
                    const data = await getUserAlerts(userId);
                    setAlerts([...defaultAlerts, ...data.map(n => ({
                        id: n.id,
                        type: (n.type as any) || 'info',
                        title: n.title,
                        description: n.body,
                        href: n.actionUrl || '#',
                    }))]);
                } catch (e) {
                    console.error('Failed to load alerts', e);
                }
            });
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <div className='relative'>
                    {children}
                    {hasAlerts && (
                        <div className='absolute -top-1 -right-1 flex h-3 w-3'>
                            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75'></span>
                            <span className='relative inline-flex rounded-full h-3 w-3 bg-destructive'></span>
                        </div>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className='w-80 p-0' align='end'>
                <div className='p-4'>
                    <h4 className='text-lg font-medium leading-none'>الإشعارات</h4>
                </div>
                {isPending ? (
                    <div className='border-t border-border p-6 flex justify-center'>
                        <div className='flex items-center gap-1'>
                            {['0s', '0.15s', '0.3s'].map((delay) => (
                                <span
                                    key={delay}
                                    className='block h-3 w-3 rounded-full bg-muted/60 animate-bounce'
                                    style={{ animationDelay: delay }}
                                />
                            ))}
                        </div>
                    </div>
                ) : hasAlerts ? (
                    <>
                        <div className='border-t border-border max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-muted/60 scrollbar-track-transparent'>
                            {alerts.map((alert) => {
                                const typeKey = (alert.type || '').toLowerCase();
                                const iconName = iconMap[typeKey as keyof typeof iconMap] || fallbackIcon;
                                const textColor = colorMap[typeKey as keyof typeof colorMap] || fallbackColor;
                                console.log(alert.title);
                                return (
                                    <Link
                                        key={alert.id}
                                        href={alert.href}
                                        className='block p-4 hover:bg-muted/50 transition-colors'
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className='flex items-start gap-3'>
                                            <Icon name={iconName} size="md" className={`flex-shrink-0 ${textColor}`} />
                                            <div className='space-y-1'>
                                                <p className={`font-semibold ${textColor}`}>
                                                    {alert.title}
                                                </p>
                                                <p className='text-sm text-muted-foreground'>
                                                    {alert.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                        <div className='border-t border-border p-3 text-center'>
                            <Link
                                href='/user/notifications'
                                className='btn-view-outline inline-flex items-center justify-center gap-2 rounded-md h-8 w-full text-sm hover:bg-muted/50 transition-colors'
                                onClick={() => setIsOpen(false)}
                            >
                                عرض كل الإشعارات
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className='border-t border-border p-4 text-center text-muted-foreground'>
                        <Icon name="Bell" size="lg" className="mx-auto text-muted/30" />
                        <p className='mt-2'>لا توجد إشعارات جديدة</p>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
} 