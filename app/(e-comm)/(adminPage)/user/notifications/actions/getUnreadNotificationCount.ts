"use server";
import db from '@/lib/prisma';

export async function getUnreadNotificationCount(userId: string) {
  return db.userNotification.count({
    where: { userId, read: false },
  });
} 