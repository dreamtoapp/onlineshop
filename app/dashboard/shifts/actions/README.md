# Shifts Actions

This folder contains server actions for the shifts management module.

## Actions

- **createShift.ts** - Server action to create a new shift in the database
- **deleteShift.ts** - Server action to delete an existing shift by ID
- **fetchShifts.ts** - Server action to retrieve all shifts from the database
- **README.md** - This documentation file

## Usage

These server actions handle all database operations for shifts:

- **createShift** - Creates new shifts with validation and error handling
- **deleteShift** - Removes shifts with proper error handling
- **fetchShifts** - Retrieves shifts with optimized field selection

## Benefits

- **Server-side Operations** - All database operations happen on the server
- **Type Safety** - Full TypeScript support with proper error handling
- **Reusability** - Actions can be imported and used across components
- **Performance** - Optimized database queries with selective field fetching
- **Error Handling** - Consistent error handling and user feedback
