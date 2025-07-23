# 🗄️ Schema Updates for Trip Management System

## 📊 Current State Analysis

### ✅ **Existing Models (Can Be Extended)**
- `OrderInWay` - Basic order tracking (one order per driver)
- `LocationHistory` - Driver location tracking
- `User` - Driver information with vehicle details
- `Order` - Order management with status tracking

### ❌ **Missing Models (Need to Create)**
- Trip management system
- Multi-order bundling
- Trip status tracking
- Delivery sequence management

### 🔍 **Current Limitations**
- **Single Order Tracking**: OrderInWay only handles one order per driver
- **No Trip Concept**: No way to group multiple orders into a single delivery trip
- **No Sequence Control**: Orders delivered individually, no manual reordering
- **Limited Location Context**: LocationHistory not tied to specific trips

---

## 🔧 Required Schema Updates

### 1. **Add Trip Status Enum**
```prisma
enum TripStatus {
  PREPARING    // Trip created, driver selecting sequence
  IN_TRANSIT   // Driver on the road delivering
  DELIVERED    // All orders completed
}
```

### 2. **Create ActiveTrips Model**
```prisma
model ActiveTrip {
  id                    String    @id @default(auto()) @map("_id") @db.ObjectId
  driverId              String    @db.ObjectId
  driver                User      @relation("DriverActiveTrips", fields: [driverId], references: [id])
  status                TripStatus @default(PREPARING)
  startTime             DateTime?
  estimatedEndTime      DateTime?
  currentLat            String?
  currentLng            String?
  lastLocationUpdate    DateTime?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // Relations
  tripOrders            TripOrder[]
  locationHistory       LocationHistory[]

  @@unique([driverId, status]) // One active trip per driver
  @@map("active_trips")
}
```

### 3. **Create TripOrder Model**
```prisma
model TripOrder {
  id              String      @id @default(auto()) @map("_id") @db.ObjectId
  tripId          String      @db.ObjectId
  trip            ActiveTrip  @relation(fields: [tripId], references: [id], onDelete: Cascade)
  orderId         String      @db.ObjectId
  order           Order       @relation("OrderTripOrders", fields: [orderId], references: [id])
  sequenceNumber  Int         // Delivery sequence (1, 2, 3, etc.)
  status          OrderStatus @default(ASSIGNED)
  deliveredAt     DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@unique([tripId, orderId]) // One order per trip
  @@unique([tripId, sequenceNumber]) // Unique sequence per trip
  @@map("trip_orders")
}
```

### 4. **Update LocationHistory Model**
```prisma
model LocationHistory {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  driverId  String   @db.ObjectId
  driver    User     @relation("DriverLocationHistory", fields: [driverId], references: [id])
  tripId    String?  @db.ObjectId // Add trip reference
  trip      ActiveTrip? @relation(fields: [tripId], references: [id])
  orderId   String?  @db.ObjectId
  latitude  String?
  longitude String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("location_history")
}
```

### 5. **Update User Model Relations**
```prisma
model User {
  // ... existing fields ...

  // Add new relations
  activeTrips        ActiveTrip[]        @relation("DriverActiveTrips")
  tripOrders         TripOrder[]         @relation("DriverTripOrders")
  locationHistory    LocationHistory[]   @relation("DriverLocationHistory")
}
```

### 6. **Update Order Model Relations**
```prisma
model Order {
  // ... existing fields ...

  // Add new relations
  tripOrders         TripOrder[]         @relation("OrderTripOrders")
}
```

---

## 📁 File Changes Required

### 1. **Update Prisma Schema**
**File**: `prisma/schema.prisma`
```prisma
// Add new enum
enum TripStatus {
  PREPARING
  IN_TRANSIT
  DELIVERED
}

// Add new models (ActiveTrip, TripOrder)
// Update existing models (User, Order, LocationHistory)
```

### 2. **Update Type Definitions**
**File**: `types/databaseTypes.ts`
```typescript
// Add new types
export interface ActiveTrip {
  id: string;
  driverId: string;
  status: TripStatus;
  startTime?: Date;
  estimatedEndTime?: Date;
  currentLat?: string;
  currentLng?: string;
  lastLocationUpdate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TripOrder {
  id: string;
  tripId: string;
  orderId: string;
  sequenceNumber: number;
  status: OrderStatus;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. **Update Database Queries**
**Files to Update**:
- `app/driver/actions/getOrderByStatus.ts`
- `app/dashboard/management-orders/assign-driver/[orderId]/actions/get-drivers.ts`
- `utils/syncOrderInWay.ts`

### 4. **Create New Actions**
**New Files**:
- `app/driver/actions/createTrip.ts`
- `app/driver/actions/updateTripSequence.ts`
- `app/driver/actions/startTrip.ts`
- `app/driver/actions/deliverOrder.ts`
- `app/driver/actions/updateDriverLocation.ts`

---

## 🔄 Migration Strategy

### Phase 1: Add New Models (Non-Breaking)
1. **Add TripStatus enum** to schema
2. **Create ActiveTrip model** with relations
3. **Create TripOrder model** with constraints
4. **Update LocationHistory model** with trip reference

### Phase 2: Update Relations (Non-Breaking)
1. **Add relations to User model**
2. **Add relations to Order model**
3. **Create database indexes** for performance
4. **Generate Prisma client**

### Phase 3: Data Migration (Optional)
1. **Migrate existing OrderInWay data** to new structure
2. **Create initial trips** from existing IN_TRANSIT orders
3. **Preserve existing location history**
4. **Update existing queries** to use new models

---

## 📋 Implementation Steps

### Step 1: Schema Updates
```bash
# 1. Update schema.prisma with new models
# 2. Generate Prisma client
npx prisma generate

# 3. Create migration
npx prisma db push

# 4. Verify database structure
npx prisma studio
```

### Step 2: Update Existing Code
1. **Update OrderInWay references** to use new TripOrder model
2. **Modify location tracking** to use ActiveTrip
3. **Update driver queries** to include trip information
4. **Add trip management actions**

### Step 3: Backward Compatibility
1. **Keep OrderInWay model** for existing functionality
2. **Gradually migrate** to new trip system
3. **Add data sync** between old and new systems
4. **Remove old models** after full migration

---

## 🎯 Benefits of New Schema

### **Enhanced Trip Management**
- ✅ **Multi-order bundling** - One trip, multiple orders
- ✅ **Delivery sequence** - Manual order control
- ✅ **Trip status tracking** - Clear state management
- ✅ **Location history** - Trip-specific tracking

### **Better Performance**
- ✅ **Optimized queries** - Direct trip relationships
- ✅ **Indexed fields** - Fast location lookups
- ✅ **Reduced complexity** - Simplified data structure

### **Scalability**
- ✅ **Future-proof** - Easy to extend
- ✅ **Real-time ready** - Built for live updates
- ✅ **Analytics friendly** - Rich data for reporting

---

## ⚠️ Important Considerations

### **Data Migration**
- **Preserve existing data** during migration
- **Test thoroughly** before production
- **Rollback plan** if issues arise

### **Backward Compatibility**
- **Keep existing APIs** working
- **Gradual migration** approach
- **Feature flags** for new functionality

### **Performance Impact**
- **Monitor query performance** after changes
- **Add proper indexes** for new relationships
- **Test with real data** volumes

---

## 🚀 Next Steps

### **Immediate Actions**
1. **Update schema.prisma** with new models
2. **Generate Prisma client** and test
3. **Create basic trip actions** for testing
4. **Update existing queries** to work with new schema

### **Testing Strategy**
1. **Unit tests** for new models
2. **Integration tests** for trip flow
3. **Performance tests** with real data
4. **User acceptance testing** with drivers

### **Deployment Plan**
1. **Staging environment** testing
2. **Gradual rollout** to production
3. **Monitor performance** and errors
4. **Full migration** after validation

---

**Ready to implement these schema updates for the trip management system! 🚀** 