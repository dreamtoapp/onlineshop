import db from '@/lib/prisma';

export async function getUserStatement(userId: string) {
  if (!userId) {
    // Prevent Prisma error if userId is undefined/null
    return null;
  }
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        customerOrders: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    // Removed console.error to keep build output clean
    throw error;
  }
}
