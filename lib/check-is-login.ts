// lib/check-is-login.ts
'use server';

import { auth } from '@/auth';
import { User } from '@/types/databaseTypes';
import db from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

// Define a consistent partial user type for authentication
type AuthUser = Pick<User, 'id' | 'email' | 'name' | 'role' | 'isActive'>;

// Simple cache function in the same file
const getCachedUser = unstable_cache(
  async (userId: string): Promise<AuthUser | null> => {
    try {
      return await db.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, role: true, isActive: true }
      });
    } catch (error) {
      console.error('[CACHE_ERROR]', error);
      return null;
    }
  },
  ['user-data'],
  { tags: ['user'], revalidate: 5 * 60 }
);

export const checkIsLogin = async (): Promise<AuthUser | null> => {
  try {
    const session = await auth();

    // Check session exists
    if (!session?.user?.id) {
      return null;
    }

    // Try cache first
    let user: AuthUser | null = await getCachedUser(session.user.id);

    // If not in cache, fetch from DB
    if (!user) {
      user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, email: true, name: true, role: true, isActive: true }
      });
    }

    if (!user) {
      return null;
    }

    if (!user.isActive) {
      return null;
    }

    return user;

  } catch (error) {
    console.error('[AUTH_ERROR]', error);
    return null;
  }
};
