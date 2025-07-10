'use server';

import { cacheData } from '@/lib/cache';
import db from '@/lib/prisma';

// Cached company info (1 hour revalidate, tag for on-demand invalidation)
export const companyInfo = async () => {
  return await cacheData(
    async () => {
      console.log('🏢 FETCHING COMPANY INFO FROM DB! 🏢');
      return await db.company.findFirst();
    },
    ['companyInfo'],
    { revalidate: 3600, tags: ['company'] }
  )();
};
