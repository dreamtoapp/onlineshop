'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UI_TEXT } from '../helpers/uiText';
import AddShiftModal from './AddShiftModal';


export default function AddShiftButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleShiftAdded = () => {
    // Refresh the page to show the new shift
    window.location.reload();
  };

  return (
    <>
      <div className='flex justify-end'>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className='bg-green-600 text-white hover:bg-green-700'
          aria-label={UI_TEXT.addShiftButton}
        >
          {UI_TEXT.addShiftButton}
        </Button>
      </div>

      {/* Add Shift Dialog */}
      <AddShiftModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onShiftAdded={handleShiftAdded}
      />
    </>
  );
}
