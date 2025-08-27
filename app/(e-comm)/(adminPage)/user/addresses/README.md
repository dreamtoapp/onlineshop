# Address Management System

This folder contains the organized components and functionality for the address management system.

## Folder Structure

### 📁 **components/**
UI components for the address management interface:
- **AddressManagement.tsx** - Main container component that orchestrates all functionality
- **AddressForm.tsx** - Form component for adding/editing addresses
- **AddressFormDialog.tsx** - Dialog wrapper for the address form
- **AddressHeader.tsx** - Header section with title, description, and action buttons
- **EmptyAddressState.tsx** - Empty state display when no addresses exist
- **AddressCard.tsx** - Individual address card with actions and information
- **AddressList.tsx** - Container for rendering the list of address cards

### 📁 **actions/**
Server actions for database operations:
- **addressActions.ts** - CRUD operations for addresses (create, read, update, delete, set default)

### 📁 **helpers/**
Utility functions, hooks, and constants:
- **addressFormatters.ts** - Address formatting and coordinate utilities
- **useAddressState.ts** - Custom hook for address state management
- **addressConstants.ts** - Constants, enums, and message strings
- **index.ts** - Main export file for all helpers

## Benefits of This Organization

1. **Single Responsibility** - Each component has one clear purpose
2. **Reusability** - Components can be easily reused in other parts of the app
3. **Maintainability** - Easier to debug and modify specific functionality
4. **Testing** - Smaller components are easier to unit test
5. **Code Splitting** - Better tree-shaking and performance optimization
6. **Consistency** - Centralized constants and utility functions
7. **Type Safety** - Proper TypeScript interfaces and validation

## Data Flow

```
AddressManagement (State & Logic)
├── AddressHeader (UI)
├── EmptyAddressState (UI)
├── AddressList (Container)
│   └── AddressCard[] (Individual Items)
└── AddressFormDialog (Form Container)
    └── AddressForm (Form Logic)
```

## Helper Functions

### **Address Formatters**
- `formatCoordinate()` - Format coordinates to 7 decimal places
- `formatAccuracy()` - Format accuracy with Arabic units (م/ك)
- `formatFullAddress()` - Format complete address for display
- `generateGoogleMapsUrl()` - Generate Google Maps links

### **Custom Hooks**
- `useAddressState()` - Manage address-related state and operations

### **Constants**
- `ADDRESS_TYPES` - Address type options
- `ACCURACY_THRESHOLDS` - Location accuracy thresholds
- `SUCCESS_MESSAGES` - Success message strings
- `ERROR_MESSAGES` - Error message strings
- `PLACEHOLDER_TEXTS` - Form placeholder texts

## Usage Example

```typescript
import { 
  formatCoordinate, 
  formatAccuracy, 
  useAddressState,
  SUCCESS_MESSAGES 
} from '../helpers';

// Use helper functions
const formattedLat = formatCoordinate(latitude);
const accuracyText = formatAccuracy(accuracy);

// Use custom hook
const { addresses, handleAddAddress } = useAddressState();

// Use constants
toast.success(SUCCESS_MESSAGES.ADDRESS_CREATED);
```

## File Organization Rules

- **UI components** go in `components/`
- **Server actions** go in `actions/`
- **Utility functions/hooks** go in `helpers/`
- Each folder has a `README.md` explaining its purpose
- Helper functions are exported through `helpers/index.ts`














