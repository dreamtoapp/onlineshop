# 🔔 Pusher Environment Variables Setup

Add these environment variables to your `.env.local` file:

```bash
# Pusher Configuration for Real-Time Notifications
PUSHER_APP_ID=your_app_id_here
NEXT_PUBLIC_PUSHER_KEY=your_key_here  
PUSHER_SECRET=your_secret_here
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster_here
```

## 🚀 How to Get Pusher Credentials:

1. **Create Pusher Account**: Go to https://pusher.com/
2. **Create New App**: 
   - Choose "Channels" product
   - Set up app name (e.g., "OnlineShop-Notifications")
   - Choose your preferred cluster (e.g., "eu", "us2", "ap3")
3. **Get Credentials**: 
   - Go to "App Keys" tab
   - Copy: `app_id`, `key`, `secret`, `cluster`
4. **Add to `.env.local`**: Replace the placeholder values above

## 🔧 Test Configuration:

After adding the environment variables:

1. **Restart your development server**: `pnpm dev`
2. **Check console**: Look for "✅ Pusher connected" message
3. **Test real-time notifications**: Use the test endpoint or driver app

## 📱 Testing Real-Time Trip Notifications:

1. **Login as a customer**
2. **Create/assign an order to a driver** 
3. **Use test endpoint**: `POST /api/test/start-trip`
   ```json
   {
     "orderId": "your-order-id",
     "driverId": "your-driver-id"
   }
   ```
4. **Watch for**:
   - Toast notification appears instantly
   - Notification sound plays
   - Console shows "🔔 Real-time notification received"
   - Connection status shows "متصل" (connected)

## 🎯 What Happens When Driver Starts Trip:

1. **Driver clicks "بدء الرحلة"** in driver app
2. **Order status changes**: `ASSIGNED` → `IN_TRANSIT`
3. **Database notification created** for customer
4. **Real-time Pusher event sent** to customer's channel
5. **Customer sees instant notification**: "بدأ السائق في التوجه إليك 🚗"
6. **Toast notification appears** with action button
7. **Notification sound plays** (if enabled)

## 🔒 Security Notes:

- **Private channels**: Each user gets their own channel `user-{userId}`
- **Authentication check**: Only user's own notifications are sent
- **Database security**: Users can only mark their own notifications as read
- **Test endpoint**: Only accessible to authenticated users 