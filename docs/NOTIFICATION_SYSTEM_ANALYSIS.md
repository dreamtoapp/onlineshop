# 🔔 Notification System Analysis & Implementation Plan

## 📊 Current State Overview

### Database Schema
```prisma
model UserNotification {
  id        String           @id @default(auto()) @map("_id") @db.ObjectId
  userId    String?          @db.ObjectId
  user      User?            @relation(fields: [userId], references: [id])
  title     String
  body      String
  type      NotificationType // WARNING, DESTRUCTIVE, INFO, SUCCESS, ORDER, PROMO, SYSTEM
  read      Boolean          @default(false)
  actionUrl String?
  icon      String?
  channel   String           @default("in-app")
  createdAt DateTime         @default(now())
}

enum NotificationType {
  WARNING      // تحذيرات
  DESTRUCTIVE  // تنبيهات مهمة
  INFO         // معلومات عامة
  SUCCESS      // رسائل نجاح
  ORDER        // إشعارات الطلبات
  PROMO        // العروض والخصومات
  SYSTEM       // إشعارات النظام
}
```

### 🏗️ Architecture Components

#### 1. Real-time Layer (Pusher)
- **Channels**: `orders`, `admin`
- **Events**: `new-order`, `order-updated`
- **File**: `app/dashboard/management/PusherNotify.tsx`

#### 2. Client State Management
- **Store**: `components/ui/notificationStore.ts` (Zustand)
- **UI Portal**: `components/ui/NotificationPortal.tsx`
- **Dropdown**: `app/(e-comm)/homepage/component/Header/NotificationDropdown.tsx`

#### 3. API Endpoints
- `GET /api/user/notifications` - Fetch user notifications
- `POST /api/user/notifications/read-all` - Mark all as read
- `POST /api/user/notifications/[id]/read` - Mark single as read

#### 4. User Interface
- **User Page**: `/user/notifications`
- **Admin Dashboard**: `/dashboard/management-notification`

## ❌ Critical Issues Found

### 1. Mock Data Usage
**Location**: `app/api/user/notifications/route.ts`
```typescript
// ❌ ISSUE: Still using hardcoded mock data
const notifications = [
  {
    id: '1',
    title: 'طلب جديد',
    body: 'لقد تم تقديم طلب جديد برقم #12345.',
    // ...
  }
]
```
**Impact**: Users see fake notifications instead of real data

### 2. Incomplete Mark-as-Read
**Location**: `app/(e-comm)/(adminPage)/user/notifications/actions/markAsRead.ts`
```typescript
// ❌ ISSUE: No actual database update
export async function handleMarkAsRead(id: string) {
  console.log(`Marking notification ${id} as read`);
  // TODO: Implement actual database update here
  return true;
}
```
**Impact**: Read status doesn't persist

### 3. Limited Notification Triggers
**Current triggers**:
- ✅ New orders (`createDraftOrder`)
- ✅ Contact form submissions
- ✅ Newsletter subscriptions

**Missing triggers**:
- ❌ Order status updates
- ❌ Delivery confirmations
- ❌ Product restocks
- ❌ Promotions/offers
- ❌ Driver assignments
- ❌ Payment confirmations

### 4. Inconsistent API Implementation
- Some endpoints use console.log instead of DB operations
- Missing error handling
- No pagination for large notification lists

## 🎯 Implementation Plan

### Phase 1: Fix Core Functionality (Priority: HIGH)

#### 1.1 Replace Mock Data with Real DB Queries
```typescript
// File: app/api/user/notifications/route.ts
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notifications = await db.userNotification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50 // Pagination
  });

  return NextResponse.json(notifications);
}
```

#### 1.2 Complete Mark-as-Read Functionality
```typescript
// File: app/(e-comm)/(adminPage)/user/notifications/actions/markAsRead.ts
export async function handleMarkAsRead(id: string) {
  return await db.userNotification.update({
    where: { id },
    data: { read: true }
  });
}

export async function markAllAsRead(userId: string) {
  return await db.userNotification.updateMany({
    where: { userId, read: false },
    data: { read: true }
  });
}
```

#### 1.3 Fix User Notifications Page
```typescript
// File: app/(e-comm)/(adminPage)/user/notifications/actions/getUserNotifications.ts
export async function getUserNotifications(userId: string) {
  return await db.userNotification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
}
```

### Phase 2: Add Comprehensive Notification Triggers (Priority: MEDIUM)

#### 2.1 Order Status Updates
```typescript
// Add to order status update functions
await createNotification({
  userId: order.customerId,
  title: 'تحديث حالة الطلب',
  body: `تم تحديث حالة طلبك #${order.orderNumber} إلى ${getStatusInArabic(newStatus)}`,
  type: 'ORDER',
  actionUrl: `/user/orders/${order.id}`
});
```

#### 2.2 Driver Assignment Notifications
```typescript
// Add to assignDriverToOrder function
await createNotification({
  userId: order.customerId,
  title: 'تم تعيين سائق',
  body: `تم تعيين السائق ${driver.name} لتوصيل طلبك #${order.orderNumber}`,
  type: 'ORDER',
  actionUrl: `/user/orders/${order.id}`
});
```

#### 2.3 Promotion Notifications
```typescript
// Add to offer creation/update
await createNotification({
  userId: user.id,
  title: 'عرض خاص جديد',
  body: `خصم ${offer.discountPercentage}% على ${offer.title}`,
  type: 'PROMO',
  actionUrl: `/offers/${offer.id}`
});
```

### Phase 3: Enhanced Features (Priority: LOW)

#### 3.1 Notification Preferences
```prisma
model NotificationPreferences {
  id       String @id @default(auto()) @map("_id") @db.ObjectId
  userId   String @unique @db.ObjectId
  user     User   @relation(fields: [userId], references: [id])
  
  emailOrders      Boolean @default(true)
  emailPromotions  Boolean @default(true)
  emailSystem      Boolean @default(true)
  
  pushOrders       Boolean @default(true)
  pushPromotions   Boolean @default(false)
  pushSystem       Boolean @default(true)
  
  inAppAll         Boolean @default(true)
}
```

#### 3.2 Email Notifications
```typescript
// Add email notification service
export async function sendEmailNotification({
  userId,
  subject,
  body,
  template
}: EmailNotificationParams) {
  // Integration with email service (SendGrid, etc.)
}
```

#### 3.3 Push Notifications
```typescript
// Add push notification service
export async function sendPushNotification({
  userId,
  title,
  body,
  data
}: PushNotificationParams) {
  // Integration with Firebase/OneSignal
}
```

## 🔧 Helper Functions to Create

### 1. Notification Creator Utility
```typescript
// File: lib/notifications/create.ts
export async function createNotification({
  userId,
  title,
  body,
  type,
  actionUrl,
  sendEmail = false,
  sendPush = false
}: CreateNotificationParams) {
  // Create in-app notification
  const notification = await db.userNotification.create({
    data: { userId, title, body, type, actionUrl }
  });

  // Send real-time via Pusher
  await pusherServer.trigger(`user-${userId}`, 'new-notification', notification);

  // Optional email/push
  if (sendEmail) await sendEmailNotification({ userId, subject: title, body });
  if (sendPush) await sendPushNotification({ userId, title, body });

  return notification;
}
```

### 2. Notification Templates
```typescript
// File: lib/notifications/templates.ts
export const notificationTemplates = {
  orderConfirmed: (orderNumber: string) => ({
    title: 'تم تأكيد طلبك',
    body: `تم تأكيد طلبك رقم #${orderNumber} وسيتم تحضيره قريباً`,
    type: 'ORDER' as const
  }),
  
  orderDelivered: (orderNumber: string) => ({
    title: 'تم توصيل طلبك',
    body: `تم توصيل طلبك رقم #${orderNumber} بنجاح`,
    type: 'SUCCESS' as const
  }),
  
  newPromotion: (title: string, discount: number) => ({
    title: 'عرض خاص جديد',
    body: `خصم ${discount}% على ${title}`,
    type: 'PROMO' as const
  })
};
```

## 📝 Testing Plan

### 1. Unit Tests
- Test notification creation
- Test mark-as-read functionality
- Test filtering and pagination

### 2. Integration Tests
- Test real-time notifications
- Test email integration
- Test push notifications

### 3. E2E Tests
- Test complete notification flow
- Test user interactions
- Test admin management

## 🚀 Deployment Checklist

- [ ] Fix mock data in API endpoints
- [ ] Complete mark-as-read functionality  
- [ ] Add notification triggers to order flow
- [ ] Test real-time notifications
- [ ] Add error handling
- [ ] Update user interface
- [ ] Add admin bulk actions
- [ ] Test with real users
- [ ] Monitor performance
- [ ] Document API changes

## 📊 Metrics to Track

- Notification delivery rate
- Read rate by type
- User engagement with actionable notifications
- Real-time delivery performance
- Email/push notification success rates

---

## 🤔 Discussion Points

1. **Priority**: Which phase should we tackle first?
2. **Email Service**: Which email provider to integrate?
3. **Push Notifications**: Firebase vs OneSignal vs native?
4. **User Preferences**: How granular should notification settings be?
5. **Performance**: How to handle high-volume notifications?
6. **Retention**: How long to keep old notifications?

---

**Next Steps**: Choose implementation priority and begin Phase 1 fixes. 