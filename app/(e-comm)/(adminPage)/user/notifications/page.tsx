'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle, Bell, BellOff, Filter, User, ShoppingCart, Settings, Megaphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserNotifications } from './actions/getUserNotifications';
import { handleMarkAsRead, markAllAsRead } from './actions/markAsRead';

type NotificationType = 'order' | 'system' | 'user' | 'promotion';

interface Notification {
    id: string;
    title: string;
    body: string;
    type: NotificationType;
    read: boolean;
    createdAt: string;
    actionUrl?: string;
    isNew?: boolean;
    mentionedUser?: {
        name: string;
        image?: string;
    };
}

export default function NotificationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<NotificationType | 'all'>('all');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                setError(null);
                if (session?.user?.id) {
                    const data = await getUserNotifications(session.user.id);
                    setNotifications(data.map((n: any) => ({
                        ...n,
                        isNew: new Date().getTime() - new Date(n.createdAt).getTime() < 3600000 // 1 hour
                    })));
                }
            } catch (error) {
                console.error('Failed to fetch notifications', error);
                setError('فشل في تحميل الإشعارات. يرجى المحاولة لاحقًا.');
            } finally {
                setLoading(false);
            }
        };

        if (session?.user?.id) {
            fetchNotifications();
        }
    }, [session]);

    const handleMarkAsReadAction = async (id: string) => {
        try {
            await handleMarkAsRead(id);
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, read: true, isNew: false } : n
            ));
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    const handleMarkAllAsReadAction = async () => {
        try {
            if (session?.user?.id) {
                await markAllAsRead(session.user.id);
                setNotifications(prev => prev.map(n => ({ ...n, read: true, isNew: false })));
            }
        } catch (error) {
            console.error('Failed to mark all notifications as read', error);
        }
    };

    const handleActionClick = (url: string) => {
        router.push(url);
    };

    const filteredNotifications = activeFilter === 'all'
        ? notifications
        : notifications.filter(n => n.type === activeFilter);

    const notificationTypes: NotificationType[] = ['order', 'system', 'user', 'promotion'];

    if (status === 'loading' || loading) {
        return (
            <div className="max-w-2xl mx-auto p-4 space-y-4">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-8 w-32" />
                </div>
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-20" />
                    ))}
                </div>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2 p-4 border rounded-lg">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!session?.user) {
        return <div className="text-center py-10">يجب تسجيل الدخول لعرض الإشعارات</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Bell className="h-6 w-6 text-feature-analytics" />
                    الإشعارات
                    <Badge variant="outline" className="ml-2">
                        {notifications.filter(n => !n.read).length} غير مقروء
                    </Badge>
                </h1>
                {notifications.length > 0 && (
                    <Button
                        onClick={handleMarkAllAsReadAction}
                        variant="ghost"
                        className="text-feature-analytics hover:bg-feature-analytics-soft"
                    >
                        <BellOff className="h-4 w-4 mr-2" />
                        تمييز الكل كمقروء
                    </Button>
                )}
            </div>

            {/* Filter controls */}
            <div className="flex justify-between mb-4 overflow-x-auto pb-2">
                <Button
                    variant={activeFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setActiveFilter('all')}
                    className="flex items-center gap-2 min-w-[60px]"
                >
                    <Filter className="h-4 w-4" />
                    <span className="hidden md:inline">الكل</span>
                </Button>
                {notificationTypes.map(type => (
                    <Button
                        key={type}
                        variant={activeFilter === type ? 'default' : 'outline'}
                        onClick={() => setActiveFilter(type)}
                        className="min-w-[40px] md:min-w-[100px]"
                    >
                        {type === 'order' && <ShoppingCart className="h-4 w-4 mr-2 md:mr-2" />}
                        {type === 'system' && <Settings className="h-4 w-4 mr-2 md:mr-2" />}
                        {type === 'user' && <User className="h-4 w-4 mr-2 md:mr-2" />}
                        {type === 'promotion' && <Megaphone className="h-4 w-4 mr-2 md:mr-2" />}
                        <span className="hidden md:inline">
                            {type === 'order' && 'الطلبات'}
                            {type === 'system' && 'النظام'}
                            {type === 'user' && 'المستخدمين'}
                            {type === 'promotion' && 'العروض'}
                        </span>
                    </Button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                        <BellOff className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground text-lg">لا توجد إشعارات حالياً</p>
                        <p className="text-sm text-muted-foreground max-w-md">
                            سيظهر هنا أي إشعارات جديدة تتلقاها حول طلباتك، نشاط الحساب والعروض الخاصة
                        </p>
                        <Button variant="outline" className="mt-4" onClick={() => router.push('/')}>
                            تصفح المتجر
                        </Button>
                    </div>
                ) : (
                    filteredNotifications.map((n) => (
                        <div key={n.id} className="animate-in fade-in slide-in-from-bottom-5">
                            <Card className={`relative shadow-lg border-l-8 transition-all duration-300 ${n.read
                                ? 'border-border hover:shadow-md bg-background/80'
                                : 'border-feature-analytics card-border-glow hover:shadow-xl bg-background'
                                } card-hover-effect overflow-hidden`}>
                                {n.isNew && !n.read && (
                                    <Badge variant="default" className="absolute -top-2 -right-2 animate-pulse">
                                        جديد
                                    </Badge>
                                )}
                                <div className={`absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-transparent to-feature-analytics/30 ${n.read ? 'opacity-0' : 'opacity-100'} transition-opacity`}></div>
                                <CardHeader className="pb-3 pt-2 px-4 flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg font-medium">
                                        {n.mentionedUser ? (
                                            <Avatar className="h-8 w-8 ring-1 ring-feature-analytics/20">
                                                <AvatarImage src={n.mentionedUser.image} />
                                                <AvatarFallback className="bg-feature-analytics/20">
                                                    {n.mentionedUser.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        ) : (
                                            <span className={`h-6 w-6 icon-enhanced rounded-full p-1.5 ${n.read ? 'bg-feature-analytics/10' : 'bg-feature-analytics/20'} text-feature-analytics`}>
                                                {n.type === 'order' && <ShoppingCart className="h-3.5 w-3.5" />}
                                                {n.type === 'system' && <Settings className="h-3.5 w-3.5" />}
                                                {n.type === 'user' && <User className="h-3.5 w-3.5" />}
                                                {n.type === 'promotion' && <Megaphone className="h-3.5 w-3.5" />}
                                            </span>
                                        )}
                                        <span className={n.read ? 'text-muted-foreground' : 'text-feature-analytics font-semibold'}>
                                            {n.title}
                                        </span>
                                    </CardTitle>
                                    <span className={`text-xs ${n.read ? 'text-muted-foreground/60' : 'text-muted-foreground/80'}`}>
                                        {new Date(n.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </CardHeader>
                                <CardContent className="pt-3 pb-4 px-4">
                                    <div className={`mb-3 text-sm ${n.read ? 'text-muted-foreground/70' : 'text-foreground'}`}>{n.body}</div>
                                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                                        <span className="text-xs text-muted-foreground/60 italic">
                                            {new Date(n.createdAt).toLocaleDateString('ar-EG')}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {n.actionUrl && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="btn-view-outline h-7 px-2 text-xs rounded-md hover:bg-feature-analytics/10"
                                                    onClick={() => handleActionClick(n.actionUrl!)}
                                                >
                                                    تفاصيل
                                                </Button>
                                            )}
                                            {!n.read && (
                                                <Button
                                                    onClick={() => handleMarkAsReadAction(n.id)}
                                                    size="sm"
                                                    className="btn-save h-7 px-2 text-xs rounded-md flex items-center gap-0.5"
                                                >
                                                    <CheckCircle className="h-3 w-3" />
                                                    مقروء
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
} 