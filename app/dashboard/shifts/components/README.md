# Shifts Components

This folder contains all UI components for the shifts management module.

## Components

- **AddShiftButton.tsx** - Button component that opens the add shift modal
- **AddShiftModal.tsx** - Modal dialog for adding new shifts (refactored to use smaller components)
- **ShiftCard.tsx** - Individual shift display card with delete functionality
- **ShiftsList.tsx** - List component that handles shifts display, loading states, and empty states

### Modal Sub-Components

- **ShiftNameField.tsx** - Input field for shift name with validation
- **TimeSelector.tsx** - Hour/minute selection with AM/PM toggle buttons
- **ModalFooter.tsx** - Cancel and save buttons for the modal

## Architecture

The components are organized to separate server and client concerns:

- **Server Components** (page.tsx) - Handle data fetching and initial render
- **Client Components** - Handle user interactions, state management, and real-time updates
- **Loading States** - Handled by loading.tsx with shadcn skeleton components
- **Component Composition** - Large components broken down into smaller, reusable pieces

## Usage

These components work together to provide a complete shifts management interface:

1. **ShiftsList** - Main container that renders the list of shifts with internal delete handling
2. **ShiftCard** - Individual shift display with hover effects and delete button
3. **AddShiftButton** - Button that opens the add shift modal
4. **AddShiftModal** - Form modal for creating new shifts with 12-hour time selection
   - **ShiftNameField** - Handles shift name input and validation
   - **TimeSelector** - Manages time selection for start/end times
   - **ModalFooter** - Provides action buttons

## Component Breakdown Benefits

- **Maintainability** - Each component has a single responsibility
- **Reusability** - TimeSelector can be used in other forms
- **Testing** - Smaller components are easier to test
- **Readability** - Main modal is much cleaner and easier to understand
- **Flexibility** - Easy to modify individual parts without affecting others

## Loading Functionality

- **loading.tsx** - Next.js automatic loading page with skeleton components
- **Skeleton Cards** - 6 placeholder cards that mimic the actual shifts layout
- **Smooth Transitions** - Loading state shows while server component fetches data
- **User Experience** - Immediate visual feedback during data loading

## Props

Each component accepts specific props for customization and functionality:

- **ShiftsList** - Only needs data and text constants (no function props)
- **ShiftCard** - Receives shift data and delete handler
- **AddShiftModal** - Receives modal state and callbacks
- **AddShiftButton** - Self-contained with internal state
- **ShiftNameField** - Receives name value, change handler, error, and labels
- **TimeSelector** - Receives time value, change handler, and label
- **ModalFooter** - Receives action handlers and button text

## State Management

- **ShiftsList** manages its own shifts state for real-time updates
- **AddShiftButton** manages modal open/close state
- **AddShiftModal** manages form state and validation
- **TimeSelector** manages internal time selection logic
- **No function props** needed between server and client components
- **Loading states** handled automatically by Next.js App Router with loading.tsx
