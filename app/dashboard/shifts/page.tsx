import { fetchShifts } from './actions/fetchShifts';
import ShiftsList from './components/ShiftsList';
import { UI_TEXT } from './helpers/uiText';
import AddShiftButton from './components/AddShiftButton';
import { Shift } from '@/types/databaseTypes';

export default async function ShiftsPage() {
  // Fetch shifts on the server
  let shifts: Partial<Shift>[] = [];
  try {
    shifts = await fetchShifts();
      } catch (error) {
        console.error('Error fetching shifts:', error);
    // Continue with empty shifts array if fetch fails
  }

  return (
    <div className='mx-auto max-w-6xl space-y-6 rounded-lg bg-background p-6 shadow-md'>
      {/* Header */}
      <h1 className='text-center text-3xl font-bold text-primary'>{UI_TEXT.headerTitle}</h1>

      {/* Add Shift Button */}
      <AddShiftButton />

      {/* Shifts List */}
      <ShiftsList
        shifts={shifts}
        isLoading={false}
        noShiftsMessage={UI_TEXT.noShiftsMessage}
        addShiftButtonText={UI_TEXT.addShiftButton}
        deleteButtonText={UI_TEXT.deleteButton}
        shiftDurationText={UI_TEXT.shiftDuration}
      />
    </div>
  );
}
