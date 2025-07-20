# GoogleMapsLink Component

A reusable React component that opens Google Maps with specified coordinates when clicked.

## Features

- Opens Google Maps in a new tab with the provided coordinates
- Supports both string and number coordinate formats
- Customizable button appearance and styling
- Optional icons and labels
- Error handling for invalid coordinates

## Usage

```tsx
import GoogleMapsLink from '@/components/GoogleMapsLink';

// Basic usage
<GoogleMapsLink 
  latitude="24.7136" 
  longitude="46.6753" 
/>

// Custom styling
<GoogleMapsLink 
  latitude={24.7136} 
  longitude={46.6753}
  label="عرض على الخريطة"
  variant="outline"
  size="sm"
  className="text-blue-600 hover:text-blue-800"
/>

// Without icons
<GoogleMapsLink 
  latitude="24.7136" 
  longitude="46.6753"
  showIcon={false}
  showExternalIcon={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `latitude` | `string \| number` | Required | Latitude coordinate |
| `longitude` | `string \| number` | Required | Longitude coordinate |
| `label` | `string` | `'عرض على الخريطة'` | Button text |
| `className` | `string` | `''` | Additional CSS classes |
| `variant` | `'default' \| 'outline' \| 'ghost'` | `'outline'` | Button variant |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Button size |
| `showIcon` | `boolean` | `true` | Show map pin icon |
| `showExternalIcon` | `boolean` | `true` | Show external link icon |

## Examples

### Profile Page Integration
The component is integrated into the user profile page to show the default address location:

```tsx
{defaultAddress.latitude && defaultAddress.longitude && (
  <div className="mt-2">
    <GoogleMapsLink
      latitude={defaultAddress.latitude}
      longitude={defaultAddress.longitude}
      label="عرض على الخريطة"
      variant="ghost"
      size="sm"
      className="text-green-700 hover:text-green-800 hover:bg-green-100"
    />
  </div>
)}
```

### Address Management Integration
The component is also used in the address management page for each address:

```tsx
{address.latitude && address.longitude && (
  <div className="mt-2">
    <GoogleMapsLink
      latitude={address.latitude}
      longitude={address.longitude}
      label="عرض على الخريطة"
      variant="ghost"
      size="sm"
      className="text-feature-users hover:text-feature-users/80 hover:bg-feature-users/10"
    />
  </div>
)}
```

### Checkout Integration
The component is integrated into the checkout flow in two places:

#### 1. AddressBook Component
Shows the map link for each address in the checkout address selection:

```tsx
{addr.latitude && addr.longitude && (
  <div className="mt-2">
    <GoogleMapsLink
      latitude={addr.latitude}
      longitude={addr.longitude}
      label="عرض على الخريطة"
      variant="ghost"
      size="sm"
      className="text-feature-commerce hover:text-feature-commerce/80 hover:bg-feature-commerce/10"
    />
  </div>
)}
```

#### 2. AddressListDialog Component
Shows the map link alongside the location status badge in the address management dialog:

```tsx
{address.latitude && address.longitude ? (
  <div className="flex items-center gap-2">
    <Badge variant="outline" className="text-xs border-green-600 text-green-700">
      ✅ موقع محدد
    </Badge>
    <GoogleMapsLink
      latitude={address.latitude}
      longitude={address.longitude}
      label="عرض على الخريطة"
      variant="ghost"
      size="sm"
      className="text-feature-commerce hover:text-feature-commerce/80 hover:bg-feature-commerce/10"
    />
  </div>
) : (
  <Badge variant="outline" className="text-xs border-orange-600 text-orange-700">
    ⚠️ يحتاج تحديد موقع
  </Badge>
)}
```

### Admin Dashboard Integration
The component is integrated into the admin dashboard for user management:

#### UserCard Component (Customers & Drivers)
Shows the map link for users who have location coordinates set:

```tsx
{user.latitude && user.longitude && (
  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
    <strong className='font-medium'>Location:</strong>
    <GoogleMapsLink
      latitude={user.latitude}
      longitude={user.longitude}
      label="عرض على الخريطة"
      variant="ghost"
      size="sm"
      className="text-primary hover:text-primary/80 hover:bg-primary/10"
    />
  </div>
)}
```

This integration works for both customer management (`/dashboard/management-users/customer`) and driver management (`/dashboard/management-users/drivers`) pages.

## Error Handling

The component includes error handling for invalid coordinates:
- Validates that coordinates can be parsed as numbers
- Logs errors to console for debugging
- Gracefully handles invalid input without crashing

## Browser Compatibility

- Opens Google Maps in a new tab using `window.open()`
- Uses `noopener,noreferrer` for security
- Works with all modern browsers 