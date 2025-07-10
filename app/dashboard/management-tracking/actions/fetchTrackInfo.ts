'use server';

import db from '@/lib/prisma';
// import { ActionError } from '@/types/commonType';
import { orderInWayIncludeRelation, OrderInWay } from '@/types/databaseTypes';

export const fetchTrackInfo = async (orderid: string): Promise<OrderInWay | null> => {
  try {
    // Validate orderid format
    if (!orderid || typeof orderid !== 'string' || orderid.trim().length === 0) {
      return null;
    }

    const trackInfo = await db.orderInWay.findUnique({
      where: { orderId: orderid.trim() },
      include: orderInWayIncludeRelation
    });

    return trackInfo;
  } catch (error) {
    console.error('Error fetching track info:', error);
    
    // Log error for debugging but don't throw to avoid breaking the UI
    // Instead return null to show the "not started" state
    return null;
  }
}; 