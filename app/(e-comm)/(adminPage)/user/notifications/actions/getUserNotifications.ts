"use server";
import db from '@/lib/prisma';

export async function getUserNotifications(userId: string) {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  // This would be replaced with a database call
  const notifications = [
    {
      id: '1',
      title: 'طلب جديد',
      body: 'لقد تم تقديم طلب جديد برقم #12345.',
      type: 'order',
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: '/user/purchase-history'
    },
    {
      id: '2',
      title: 'تحديث النظام',
      body: 'تم تحديث النظام إلى الإصدار الأحدث.',
      type: 'system',
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '3',
      title: 'عرض خاص',
      body: 'خصم 20% على جميع المنتجات حتى نهاية الأسبوع!',
      type: 'promotion',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      actionUrl: '/offers/special'
    },
    {
      id: '4',
      title: 'تعليق جديد',
      body: 'قام أحمد بذكرك في تعليق.',
      type: 'user',
      read: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      mentionedUser: { name: 'أحمد', image: '' },
      actionUrl: '/user/ratings'
    }
  ];
  
  return notifications;
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  return db.userNotification.count({
    where: {
      userId,
      read: false,
    },
  });
} 