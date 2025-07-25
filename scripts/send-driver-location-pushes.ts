// scripts/send-driver-location-pushes.ts
// Sends silent location-update push to all active drivers, with detailed debug logging
import db from '../lib/prisma';
import webpush from 'web-push';
import { VAPID_CONFIG, validateVapidConfig } from '../lib/vapid-config';

// Validate VAPID config and ensure all fields are present
validateVapidConfig();
if (!VAPID_CONFIG.subject || !VAPID_CONFIG.publicKey || !VAPID_CONFIG.privateKey) {
  throw new Error('VAPID config is missing required fields. Please check your environment variables.');
}
webpush.setVapidDetails(VAPID_CONFIG.subject, VAPID_CONFIG.publicKey, VAPID_CONFIG.privateKey);

async function sendLocationUpdatePushes() {
  // 1. Find all active trips with driver and push subscription
  const activeTrips = await db.activeTrip.findMany({
    include: { driver: { include: { pushSubscriptions: true } } }
  });

  console.log(`DEBUG: Found ${activeTrips.length} active trips`);
  for (const trip of activeTrips) {
    const subscription = trip.driver?.pushSubscriptions?.[0];
    if (!subscription) {
      console.log(`DEBUG: No push subscription for driver ${trip.driverId}`);
      continue;
    }
    if (!subscription.endpoint || !subscription.p256dh || !subscription.auth) {
      console.log(`DEBUG: Incomplete push subscription for driver ${trip.driverId}:`, subscription);
      continue;
    }

    // 2. Build push payload
    const payload = JSON.stringify({
      type: 'location-update',
      data: { orderId: trip.orderId }
    });

    // 3. Send push and log to terminal
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth
          }
        },
        payload
      );
      // Log to terminal for every push (minimized or not)
      console.log(`🚚 Sent location-update push to driver ${trip.driverId} for order ${trip.orderId}`);
    } catch (err) {
      console.error('❌ Push error for driver', trip.driverId, 'order', trip.orderId, ':', err);
    }
  }
}

// Run the push sender ONCE and exit
sendLocationUpdatePushes().then(() => process.exit(0)); 