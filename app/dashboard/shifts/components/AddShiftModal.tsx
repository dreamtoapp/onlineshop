'use client';
import { useState } from 'react';
import { format, parse } from 'date-fns';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { createShift } from '../actions/createShift';
import { Shift } from '@/types/databaseTypes';
import { UI_TEXT } from '../helpers/uiText';
import ShiftNameField from './ShiftNameField';
import TimeSelector from './TimeSelector';
import ModalFooter from './ModalFooter';

interface AddShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShiftAdded: (shift: Shift) => void;
}

export default function AddShiftModal({ isOpen, onClose, onShiftAdded }: AddShiftModalProps) {
  const [newShift, setNewShift] = useState<Partial<Shift>>({
    name: '',
    startTime: '',
    endTime: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handle dialog submission
  const handleAddShift = async () => {
    if (!newShift.name || !newShift.startTime || !newShift.endTime) {
      setErrors({
        name: !newShift.name ? UI_TEXT.errors.nameRequired : '',
        startTime: !newShift.startTime ? UI_TEXT.errors.startTimeRequired : '',
        endTime: !newShift.endTime ? UI_TEXT.errors.endTimeRequired : '',
      });
      return;
    }

    // Validate that startTime is not later than endTime
    const start = parse(newShift.startTime, 'HH:mm', new Date());
    const end = parse(newShift.endTime, 'HH:mm', new Date());

    if (start > end) {
      setErrors({
        ...errors,
        endTime: UI_TEXT.errors.invalidTime,
      });
      return;
    }

    try {
      const createdShift = await createShift({
        ...newShift,
        startTime: format(start, 'HH:mm'), // Convert to 24-hour format for storage
        endTime: format(end, 'HH:mm'), // Convert to 24-hour format for storage
      } as Shift);

      onShiftAdded(createdShift);
      onClose(); // Close the dialog
      setNewShift({ name: '', startTime: '', endTime: '' }); // Reset form
      setErrors({});
      toast.success(UI_TEXT.successMessages.shiftAdded);
    } catch (error) {
      console.error('Error creating shift:', error);
      toast.error(UI_TEXT.errorMessages.addShift);
    }
  };

  const handleClose = () => {
    setNewShift({ name: '', startTime: '', endTime: '' });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-md mx-auto'>
        <DialogHeader className='text-center space-y-2 pb-4'>
          <DialogTitle className='text-xl font-semibold text-foreground'>
            {UI_TEXT.addShiftButton}
          </DialogTitle>
          <DialogDescription className='text-muted-foreground text-sm'>
            {UI_TEXT.dialogDescription}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-2'>
          {/* Name Field */}
          <ShiftNameField
            name={newShift.name || ''}
            onNameChange={(name) => setNewShift({ ...newShift, name })}
            error={errors.name}
            placeholder={UI_TEXT.placeholder.shiftName}
            label={UI_TEXT.shiftName}
          />

          {/* Start Time Field */}
          <TimeSelector
            time={newShift.startTime || ''}
            onTimeChange={(startTime) => setNewShift({ ...newShift, startTime })}
            label={UI_TEXT.shiftStartTime}
          />
          {errors.startTime && (
            <p className='text-xs text-red-500 text-center'>{errors.startTime}</p>
          )}

          {/* End Time Field */}
          <TimeSelector
            time={newShift.endTime || ''}
            onTimeChange={(endTime) => setNewShift({ ...newShift, endTime })}
            label={UI_TEXT.shiftEndTime}
          />
          {errors.endTime && (
            <p className='text-xs text-red-500 text-center'>{errors.endTime}</p>
          )}
        </div>

        <DialogFooter>
          <ModalFooter
            onCancel={handleClose}
            onSave={handleAddShift}
            cancelText={UI_TEXT.cancelButton}
            saveText={UI_TEXT.saveButton}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
