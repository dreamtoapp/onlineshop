import db from '@/lib/prisma';

// 🔔 Reusable System Notification Helper
interface SystemNotificationParams {
  userId: string;
  title: string;
  body: string;
  actionUrl?: string;
}

export async function createSystemNotification({
  userId,
  title,
  body,
  actionUrl
}: SystemNotificationParams) {
  try {
    const notification = await db.userNotification.create({
      data: {
        userId,
        title,
        body,
        type: 'SYSTEM',
        read: false,
        actionUrl: actionUrl || undefined
      }
    });

    console.log('✅ System notification created:', notification.id);
    return notification;

  } catch (error) {
    console.error('❌ Error creating system notification:', error);
    throw error;
  }
}

// 🎯 Pre-built System Notifications
export const SYSTEM_NOTIFICATIONS = {
  WELCOME: {
    title: '🎉 مرحباً بك في المتجر!',
    body: 'تم إنشاء حسابك بنجاح! نحن متحمسون لخدمتك وتوفير أفضل تجربة تسوق لك.',
  },
  ADD_ADDRESS: {
    title: '📍 أضف عنوانك الأول',
    body: 'لتسهيل عملية التوصيل، يرجى إضافة عنوانك الافتراضي. هذا سيوفر عليك الوقت في الطلبات القادمة.',
  },
  ACTIVATE_ACCOUNT: {
    title: '✅ فعّل حسابك الآن',
    body: 'يرجى التحقق من رقم هاتفك لتفعيل حسابك والاستفادة من جميع مزايا المتجر والعروض الخاصة.',
  },
  ACCOUNT_VERIFIED: {
    title: 'تم تفعيل حسابك',
    body: 'تم التحقق من رقم هاتفك بنجاح. يمكنك الآن البدء في التسوق وإضافة العناوين.',
  },
  FIRST_ORDER: {
    title: 'أول طلب لك!',
    body: 'مبروك! تم تسجيل أول طلب لك بنجاح. سنتواصل معك قريباً لتأكيد التسليم.',
  }
} as const; 