# 🚀 Dynamic Tax & Shipping Calculation Implementation Plan

## 📋 **CURRENT STATE ANALYSIS**

### **❌ Hardcoded Values Found:**

1. **Cart Page (`CartPageView.tsx`):**
   ```typescript
   const shipping = subtotal > 200 ? 0 : 25; // ❌ Hardcoded: 200 SAR limit, 25 SAR fee
   const tax = subtotal * 0.15; // ❌ Hardcoded: 15% tax rate
   ```

2. **Checkout Mini Cart (`MiniCartSummary.tsx`):**
   ```typescript
   const deliveryFee = subtotal >= 200 ? 0 : 25; // ❌ Hardcoded: 200 SAR limit, 25 SAR fee
   const taxRate = 0.15; // ❌ Hardcoded: 15% tax rate
   ```

3. **Order Actions (`orderActions.ts`):**
   ```typescript
   const deliveryFee = subtotal >= 200 ? 0 : 25; // ❌ Hardcoded: 200 SAR limit, 25 SAR fee
   const taxRate = 0.15; // ❌ Hardcoded: 15% tax rate
   ```

4. **Invoice Page (`show-invoice/[invoiceid]/page.tsx`):**
   ```typescript
   const taxRate = 0.15; // ❌ Hardcoded: 15% tax rate
   ```

### **✅ Available Platform Settings:**
- `taxPercentage` (Int, default: 15)
- `shippingFee` (Int, default: 0)
- `minShipping` (Int, default: 0)

---

## 🎯 **IMPLEMENTATION STRATEGY**

### **Phase 1: Create Dynamic Calculation Service**

#### **1.1 Create Calculation Helper**
```typescript
// helpers/dynamicCalculations.ts
export interface PlatformSettings {
  taxPercentage: number;
  shippingFee: number;
  minShipping: number;
}

export interface CalculationResult {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  isFreeShipping: boolean;
  remainingForFreeShipping: number;
  freeShippingProgress: number;
}

export function calculateOrderTotals(
  subtotal: number, 
  platformSettings: PlatformSettings
): CalculationResult {
  const { taxPercentage, shippingFee, minShipping } = platformSettings;
  
  // Calculate shipping
  const isFreeShipping = subtotal >= minShipping;
  const shipping = isFreeShipping ? 0 : shippingFee;
  
  // Calculate tax (on subtotal only)
  const tax = subtotal * (taxPercentage / 100);
  
  // Calculate total
  const total = subtotal + shipping + tax;
  
  // Calculate free shipping progress
  const remainingForFreeShipping = Math.max(0, minShipping - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / minShipping) * 100);
  
  return {
    subtotal,
    shipping,
    tax,
    total,
    isFreeShipping,
    remainingForFreeShipping,
    freeShippingProgress
  };
}
```

#### **1.2 Create Cached Platform Settings Hook**
```typescript
// hooks/usePlatformSettings.ts
import { useState, useEffect } from 'react';
import { fetchCompany } from '@/app/dashboard/management/settings/actions/fetchCompany';

export function usePlatformSettings() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const companyData = await fetchCompany();
        if (companyData) {
          setSettings({
            taxPercentage: companyData.taxPercentage || 15,
            shippingFee: companyData.shippingFee || 0,
            minShipping: companyData.minShipping || 0
          });
        }
      } catch (err) {
        setError('Failed to load platform settings');
        console.error('Platform settings error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  return { settings, loading, error };
}
```

### **Phase 2: Update Cart Components**

#### **2.1 Update CartPageView.tsx**
```typescript
// app/(e-comm)/(cart-flow)/cart/components/CartPageView.tsx
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import { calculateOrderTotals } from '@/helpers/dynamicCalculations';

export default function CartPageView() {
  const { settings, loading: settingsLoading } = usePlatformSettings();
  
  // Cart calculations
  const items = Object.values(cart);
  const subtotal = items.reduce((sum, item) => 
    sum + ((item.product?.price || 0) * (item.quantity || 1)), 0
  );
  
  // Use dynamic calculations
  const calculations = settings ? 
    calculateOrderTotals(subtotal, settings) : 
    { subtotal, shipping: 0, tax: 0, total: subtotal, isFreeShipping: false, remainingForFreeShipping: 0, freeShippingProgress: 0 };

  // Pass calculations to OrderSummary
  return (
    <OrderSummary
      items={items}
      calculations={calculations}
      settingsLoading={settingsLoading}
      onCheckout={handleCheckout}
      // ... other props
    />
  );
}
```

#### **2.2 Update OrderSummary.tsx**
```typescript
// app/(e-comm)/(cart-flow)/cart/components/OrderSummary.tsx
interface OrderSummaryProps {
  items: (ServerCartItem | GuestCartItem)[];
  calculations: CalculationResult;
  settingsLoading: boolean;
  onCheckout: () => void;
  // ... other props
}

export default function OrderSummary({ calculations, settingsLoading, ...props }: OrderSummaryProps) {
  const { subtotal, shipping, tax, total, isFreeShipping, remainingForFreeShipping, freeShippingProgress } = calculations;
  
  if (settingsLoading) {
    return <OrderSummarySkeleton />;
  }
  
  return (
    <Card>
      <OrderDetails 
        items={props.items}
        subtotal={subtotal}
        shipping={shipping}
        tax={tax}
        isFreeShipping={isFreeShipping}
        remainingForFreeShipping={remainingForFreeShipping}
        freeShippingProgress={freeShippingProgress}
      />
      <TotalAmount total={total} />
      {/* ... rest of component */}
    </Card>
  );
}
```

### **Phase 3: Update Checkout Components**

#### **3.1 Update MiniCartSummary.tsx**
```typescript
// app/(e-comm)/(cart-flow)/checkout/components/MiniCartSummary.tsx
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import { calculateOrderTotals } from '@/helpers/dynamicCalculations';

export default function MiniCartSummary() {
  const { settings, loading: settingsLoading } = usePlatformSettings();
  const { cart: zustandCart } = useCartStore();
  
  const items = Object.values(zustandCart);
  const subtotal = items.reduce((sum, item) => 
    sum + (item.product?.price || 0) * (item.quantity || 1), 0
  );
  
  const calculations = settings ? 
    calculateOrderTotals(subtotal, settings) : 
    { subtotal, shipping: 0, tax: 0, total: subtotal, isFreeShipping: false, remainingForFreeShipping: 0, freeShippingProgress: 0 };

  if (settingsLoading) {
    return <MiniCartSummarySkeleton />;
  }
  
  // Use calculations object instead of hardcoded values
  const { shipping, tax, total, isFreeShipping, remainingForFreeShipping, freeShippingProgress } = calculations;
  
  return (
    // Update JSX to use dynamic values
    <div>
      {/* Tax display */}
      <div className="flex items-center justify-between">
        <span className="text-sm">ضريبة القيمة المضافة ({settings?.taxPercentage || 15}%)</span>
        <span className="font-medium">{formatCurrency(tax)}</span>
      </div>
      
      {/* Shipping display */}
      <div className="flex items-center justify-between">
        <span className="text-sm">رسوم التوصيل</span>
        <span className="font-medium">
          {isFreeShipping ? 'مجاني' : formatCurrency(shipping)}
        </span>
      </div>
      
      {/* Free shipping progress */}
      {!isFreeShipping && (
        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span>أضف {formatCurrency(remainingForFreeShipping)} للتوصيل المجاني</span>
            <span className="text-feature-commerce font-medium">
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div className="w-full bg-muted h-2 rounded-full">
            <div
              className="bg-feature-commerce h-2 rounded-full transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### **Phase 4: Update Server-Side Calculations**

#### **4.1 Update Order Actions**
```typescript
// app/(e-comm)/(cart-flow)/checkout/actions/orderActions.ts
import { fetchCompany } from '@/app/dashboard/management/settings/actions/fetchCompany';
import { calculateOrderTotals } from '@/helpers/dynamicCalculations';

export async function createDraftOrder(formData: FormData) {
  try {
    // ... existing validation code ...
    
    // Get platform settings
    const companyData = await fetchCompany();
    const platformSettings = {
      taxPercentage: companyData?.taxPercentage || 15,
      shippingFee: companyData?.shippingFee || 0,
      minShipping: companyData?.minShipping || 0
    };
    
    // Calculate totals using dynamic settings
    const subtotal = cart.items.reduce(
      (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
      0
    );
    
    const calculations = calculateOrderTotals(subtotal, platformSettings);
    const { total } = calculations;
    
    // Create order with calculated total
    const order = await db.order.create({
      data: {
        orderNumber,
        customerId: user.id,
        addressId: validatedData.addressId,
        status: "PENDING",
        amount: total, // Use dynamic total
        // ... rest of order data
      }
    });
    
    // ... rest of function
  } catch (error) {
    // ... error handling
  }
}
```

#### **4.2 Update Invoice Page**
```typescript
// app/dashboard/show-invoice/[invoiceid]/page.tsx
import { fetchCompany } from '@/app/dashboard/management/settings/actions/fetchCompany';
import { calculateOrderTotals } from '@/helpers/dynamicCalculations';

export default async function InvoicePage({ params, searchParams }: ParamsProp) {
  const orderId = (await params).invoiceid;
  const order = await getOrderData(orderId as string);
  
  // Get platform settings for tax calculation
  const companyData = await fetchCompany();
  const platformSettings = {
    taxPercentage: companyData?.taxPercentage || 15,
    shippingFee: companyData?.shippingFee || 0,
    minShipping: companyData?.minShipping || 0
  };
  
  // Calculate totals using dynamic settings
  const subtotal = order?.amount || 0;
  const calculations = calculateOrderTotals(subtotal, platformSettings);
  const { tax, total } = calculations;
  
  return (
    // Update JSX to use dynamic tax rate
    <div>
      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
        <Icon name="Calculator" className="h-5 w-5 text-feature-analytics" />
        <div>
          <p className="text-sm text-muted-foreground">الضريبة ({platformSettings.taxPercentage}%)</p>
          <p className="text-xl font-bold text-foreground">{tax.toFixed(2)} ر.س</p>
        </div>
      </div>
    </div>
  );
}
```

### **Phase 5: Create Reusable Components**

#### **5.1 Create TaxDisplay Component**
```typescript
// components/cart/TaxDisplay.tsx
interface TaxDisplayProps {
  tax: number;
  taxPercentage: number;
  className?: string;
}

export function TaxDisplay({ tax, taxPercentage, className }: TaxDisplayProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Percent className="h-4 w-4" />
        <span className="text-sm">ضريبة القيمة المضافة ({taxPercentage}%)</span>
      </div>
      <span className="font-medium">{formatCurrency(tax)}</span>
    </div>
  );
}
```

#### **5.2 Create ShippingDisplay Component**
```typescript
// components/cart/ShippingDisplay.tsx
interface ShippingDisplayProps {
  shipping: number;
  isFreeShipping: boolean;
  remainingForFreeShipping: number;
  freeShippingProgress: number;
  className?: string;
}

export function ShippingDisplay({ 
  shipping, 
  isFreeShipping, 
  remainingForFreeShipping, 
  freeShippingProgress,
  className 
}: ShippingDisplayProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Truck className="h-4 w-4" />
          <span className="text-sm">رسوم التوصيل</span>
          {isFreeShipping && (
            <Badge variant="outline" className="text-xs px-1 py-0 border-green-600 text-green-700">
              مجاني
            </Badge>
          )}
        </div>
        <span className={`font-medium ${isFreeShipping ? 'text-green-600' : ''}`}>
          {isFreeShipping ? 'مجاني' : formatCurrency(shipping)}
        </span>
      </div>
      
      {!isFreeShipping && (
        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span>أضف {formatCurrency(remainingForFreeShipping)} للتوصيل المجاني</span>
            <span className="text-feature-commerce font-medium">
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div className="w-full bg-muted h-2 rounded-full">
            <div
              className="bg-feature-commerce h-2 rounded-full transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 🔄 **IMPLEMENTATION ORDER**

### **Priority 1: Core Infrastructure**
1. ✅ Create `helpers/dynamicCalculations.ts`
2. ✅ Create `hooks/usePlatformSettings.ts`
3. ✅ Create reusable components (`TaxDisplay`, `ShippingDisplay`)

### **Priority 2: Cart & Checkout**
1. ✅ Update `CartPageView.tsx`
2. ✅ Update `OrderSummary.tsx`
3. ✅ Update `MiniCartSummary.tsx`

### **Priority 3: Server-Side**
1. ✅ Update `orderActions.ts`
2. ✅ Update invoice page

### **Priority 4: Additional Areas**
1. ✅ Update cart dropdown components
2. ✅ Update any other hardcoded calculations

---

## 🧪 **TESTING STRATEGY**

### **Unit Tests**
```typescript
// __tests__/helpers/dynamicCalculations.test.ts
describe('calculateOrderTotals', () => {
  it('should calculate correct totals with default settings', () => {
    const settings = { taxPercentage: 15, shippingFee: 25, minShipping: 200 };
    const result = calculateOrderTotals(100, settings);
    
    expect(result.shipping).toBe(25);
    expect(result.tax).toBe(15);
    expect(result.total).toBe(140);
    expect(result.isFreeShipping).toBe(false);
  });
  
  it('should provide free shipping when subtotal meets minimum', () => {
    const settings = { taxPercentage: 15, shippingFee: 25, minShipping: 200 };
    const result = calculateOrderTotals(250, settings);
    
    expect(result.shipping).toBe(0);
    expect(result.isFreeShipping).toBe(true);
    expect(result.freeShippingProgress).toBe(125);
  });
});
```

### **Integration Tests**
- Test cart calculations with different platform settings
- Test checkout flow with dynamic calculations
- Test order creation with dynamic totals

---

## 📊 **PERFORMANCE CONSIDERATIONS**

### **Caching Strategy**
- Cache platform settings for 1 hour
- Use React Query or SWR for client-side caching
- Implement server-side caching with Redis (optional)

### **Bundle Optimization**
- Lazy load calculation helpers
- Tree-shake unused calculation functions
- Use dynamic imports for platform settings

---

## 🔒 **SECURITY CONSIDERATIONS**

### **Validation**
- Validate platform settings before calculations
- Ensure tax percentage is between 0-100
- Ensure shipping values are non-negative

### **Fallbacks**
- Provide default values if platform settings fail to load
- Graceful degradation if calculations fail
- Error boundaries for calculation components

---

## 📈 **MONITORING & ANALYTICS**

### **Metrics to Track**
- Platform settings load time
- Calculation accuracy
- Error rates in dynamic calculations
- Performance impact of dynamic calculations

### **Logging**
```typescript
// Add logging to calculation helper
export function calculateOrderTotals(subtotal: number, platformSettings: PlatformSettings) {
  console.log('🔄 Calculating order totals:', { subtotal, platformSettings });
  
  const result = {
    // ... calculations
  };
  
  console.log('✅ Calculation result:', result);
  return result;
}
```

---

## 🚀 **DEPLOYMENT CHECKLIST**

- [ ] ✅ Create calculation helper functions
- [ ] ✅ Create platform settings hook
- [ ] ✅ Update all cart components
- [ ] ✅ Update checkout components
- [ ] ✅ Update server-side calculations
- [ ] ✅ Add error handling and fallbacks
- [ ] ✅ Add loading states
- [ ] ✅ Test with different platform settings
- [ ] ✅ Performance testing
- [ ] ✅ Deploy to staging
- [ ] ✅ Monitor for issues
- [ ] ✅ Deploy to production

---

## 🎯 **EXPECTED OUTCOMES**

### **Benefits**
1. **Dynamic Configuration** - Tax and shipping can be changed without code deployment
2. **Consistency** - All calculations use the same logic and values
3. **Maintainability** - Single source of truth for calculation logic
4. **Flexibility** - Easy to add new calculation rules or modify existing ones
5. **User Experience** - Real-time updates when platform settings change

### **Areas Affected**
- ✅ Cart page calculations
- ✅ Checkout page calculations
- ✅ Order creation process
- ✅ Invoice generation
- ✅ All cart-related components
- ✅ Future: Product pricing, discounts, etc.

This implementation will make the entire e-commerce system truly dynamic and configurable through the admin panel! 🎉 