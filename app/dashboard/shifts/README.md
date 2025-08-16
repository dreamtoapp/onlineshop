# Shifts Management Module

This module provides comprehensive shift management functionality for the dashboard.

## Folder Structure

```
shifts/
├── actions/           # Server actions for database operations
├── components/        # UI components for the interface
├── helpers/          # Utility functions and constants
├── page.tsx          # Main page component
└── README.md         # This documentation
```

## Components

- **page.tsx** - Main page that orchestrates all functionality
- **AddShiftModal** - Modal for adding new shifts with time selection
- **ShiftCard** - Individual shift display card
- **ShiftsList** - Container for displaying shifts with loading states

## Features

- **12-Hour Time Selection** - Intuitive hour/minute dropdowns with AM/PM toggles
- **Arabic Interface** - Full Arabic language support with proper RTL layout
- **Real-time Updates** - Immediate UI updates after operations
- **Error Handling** - Comprehensive error handling with user feedback
- **Responsive Design** - Works on all device sizes
- **Card Layout** - Clean, organized display of shift information

## Usage

The module provides a complete shifts management system:

1. **View Shifts** - Display all shifts in a responsive grid layout
2. **Add Shifts** - Create new shifts with name and time selection
3. **Delete Shifts** - Remove shifts with confirmation
4. **Time Management** - 12-hour format with AM/PM selection

## Technical Details

- **Next.js App Router** - Uses modern Next.js patterns
- **Server Actions** - Database operations handled server-side
- **TypeScript** - Full type safety throughout
- **Tailwind CSS** - Modern, responsive styling
- **shadcn/ui** - Consistent UI component library
