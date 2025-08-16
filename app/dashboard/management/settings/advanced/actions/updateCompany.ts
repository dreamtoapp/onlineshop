'use server';

import db from '@/lib/prisma';
import { revalidateTag } from 'next/cache';
import { DEFAULT_COMPANY_SETTINGS } from '@/constant/app-defaults';

export async function updateCompany(partialData: Record<string, unknown>) {
  try {
    const existing = await db.company.findFirst();
    const data = Object.fromEntries(
      Object.entries(partialData).filter(([, v]) => {
        if (typeof v === 'boolean') return true; // Always include boolean values
        if (typeof v === 'string') return v.trim() !== '';
        return v !== undefined;
      })
    );

    if (!existing) {
      // Seed with constant defaults first (no secrets should be committed to public repos).
      const created = await db.company.create({ data: { ...DEFAULT_COMPANY_SETTINGS, ...data } });
      revalidateTag('company');
      return { success: true, company: created };
    }

    const updated = await db.company.update({ where: { id: existing.id }, data });
    revalidateTag('company');
    return { success: true, company: updated };
  } catch (e) {
    return { success: false, message: 'Failed to update company settings' };
  }
}


