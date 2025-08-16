'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ShiftCard from './ShiftCard';
import { Shift } from '@/types/databaseTypes';
import { deleteShift } from '../actions/deleteShift';
import { UI_TEXT } from '../helpers/uiText';

interface ShiftsListProps {
  shifts: Partial<Shift>[];
  isLoading: boolean;
  noShiftsMessage: string;
  addShiftButtonText: string;
  deleteButtonText: string;
  shiftDurationText: string;
}

export default function ShiftsList({
  shifts: initialShifts,
  isLoading,
  noShiftsMessage,
  addShiftButtonText,
  deleteButtonText,
  shiftDurationText,
}: ShiftsListProps) {
  const [shifts, setShifts] = useState(initialShifts);

  const handleDelete = async (id: string) => {
    try {
      await deleteShift(id);
      setShifts((prevShifts) => prevShifts.filter((shift) => shift.id !== id));
      toast.success(UI_TEXT.successMessages.shiftDeleted);
    } catch (error) {
      console.error('Error deleting shift:', error);
      toast.error(UI_TEXT.errorMessages.deleteShift);
    }
  };

  const handleAddShift = () => {
    // This will be handled by the AddShiftButton component
    // We can add a callback here if needed in the future
  };

  if (isLoading) {
    return (
      <div className='flex h-40 items-center justify-center'>
        <p className='text-muted-foreground'>جاري التحميل...</p>
      </div>
    );
  }

  if (shifts.length === 0) {
    return (
      <div className='col-span-full flex flex-col items-center justify-center space-y-4'>
        <p className='text-center text-muted-foreground'>{noShiftsMessage}</p>
        <Button
          onClick={handleAddShift}
          className='bg-primary text-primary-foreground'
        >
          {addShiftButtonText}
        </Button>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {shifts.map((shift) => (
        <ShiftCard
          key={shift.id}
          shift={shift}
          onDelete={handleDelete}
          deleteButtonText={deleteButtonText}
          shiftDurationText={shiftDurationText}
        />
      ))}
    </div>
  );
}
