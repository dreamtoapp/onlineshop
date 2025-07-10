# Analytics Setup Guide

This project uses the **official Next.js third-party libraries** for analytics tracking.

## 🚀 Quick Setup

### 1. Install Package (Already Done)
```bash
pnpm add @next/third-parties
```

### 2. Add Environment Variables
Create a `.env.local` file in your project root:

```env
# Google Analytics 4 Measurement ID
# Get this from Google Analytics 4 property settings
# Format: G-XXXXXXXXXX
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Get Your Google Analytics 4 ID
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property or use existing one
3. Go to Admin → Property Settings → Property Details
4. Copy your **Measurement ID** (starts with `G-`)

## 🎯 Usage

### Automatic Tracking
- **Page views** are tracked automatically
- **Client-side navigation** is tracked automatically
- No additional setup needed for basic tracking

### Manual Event Tracking
Use the `useAnalytics` hook in your components:

```tsx
import { useAnalytics } from '@/hooks/use-analytics';

function ProductCard({ product }) {
  const analytics = useAnalytics();
  
  const handleAddToCart = () => {
    // Track the add to cart event
    analytics.trackAddToCart(product, 1);
    
    // Your add to cart logic here
  };
  
  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}
```

### Available Tracking Methods
- `trackProductView(product)` - Track product page views
- `trackAddToCart(product, quantity)` - Track add to cart events
- `trackPurchase(transaction)` - Track completed purchases
- `trackBeginCheckout(cart)` - Track checkout initiation
- `trackSearch(searchTerm)` - Track search queries
- `trackSignUp(method)` - Track user registrations
- `trackLogin(method)` - Track user logins
- `trackEvent(eventName, parameters)` - Track custom events

## 📊 What Gets Tracked

### E-commerce Events
- Product views with product details
- Add to cart with product and quantity
- Checkout initiation with cart contents
- Purchase completion with transaction details
- Search queries

### User Events
- Page views (automatic)
- User registration and login
- Custom events as needed

## 🔧 Configuration

The analytics are configured in:
- **Root Layout**: `app/layout.tsx` - GoogleAnalytics component
- **Analytics Hook**: `hooks/use-analytics.ts` - Custom tracking functions
- **Environment**: `.env.local` - Configuration variables

## 📈 Benefits of Official Next.js Approach

✅ **Optimized Performance** - Scripts load after hydration  
✅ **Automatic Page Tracking** - No manual setup needed  
✅ **TypeScript Support** - Full type safety  
✅ **Maintained by Next.js Team** - Regular updates and bug fixes  
✅ **Simple Integration** - Minimal code required  
✅ **Enhanced E-commerce** - Built-in e-commerce event support

## 🚫 What We Replaced

We replaced our custom analytics implementation with the official Next.js approach because:
- Less code to maintain
- Better performance optimizations
- Automatic handling of page views
- Official support and updates
- Simpler debugging and troubleshooting

## 📖 References

- [Next.js Third-Party Libraries Documentation](https://nextjs.org/docs/app/guides/third-party-libraries#google-analytics)
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Enhanced E-commerce Events](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce) 