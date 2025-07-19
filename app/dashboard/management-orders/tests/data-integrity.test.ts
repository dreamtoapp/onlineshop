// Test file - using Node.js test runner instead of Jest
// import { describe, test, expect } from '@jest/globals';
// import { getOrderAnalytics } from '../actions/get-order-analytics';
// import { fetchOrdersAction } from '../../management-dashboard/action/fetchOrders';
// import db from '@/lib/prisma';

// describe('Order Management Data Integrity', () => {
//   test('Order counts match database', async () => {
//     const dbCount = await db.order.count();
//     const apiResult = await getOrderAnalytics();
    
//     if (apiResult.success && apiResult.data) {
//       expect(apiResult.data.totalOrders).toBe(dbCount);
//     } else {
//       throw new Error('Analytics API failed');
//     }
//   });

//   test('Status filtering accuracy', async () => {
//     const pendingDb = await db.order.count({ where: { status: 'PENDING' } });
//     const pendingApi = await fetchOrdersAction({ status: 'PENDING' });
    
//     expect(pendingApi?.length || 0).toBe(pendingDb);
//   });

//   test('Revenue calculation accuracy', async () => {
//     const dbRevenue = await db.order.aggregate({ _sum: { amount: true } });
//     const apiResult = await getOrderAnalytics();
    
//     if (apiResult.success && apiResult.data) {
//       expect(apiResult.data.totalRevenue).toBe(dbRevenue._sum.amount || 0);
//     } else {
//       throw new Error('Analytics API failed');
//     }
//   });

//   test('Order status distribution accuracy', async () => {
//     const dbStatusCounts = await db.order.groupBy({
//       by: ['status'],
//       _count: { status: true }
//     });
    
//     const apiResult = await getOrderAnalytics();
    
//     if (apiResult.success && apiResult.data) {
//       expect(apiResult.data.ordersByStatus).toBeDefined();
//     } else {
//       throw new Error('Analytics API failed');
//     }
//   });
// }); 