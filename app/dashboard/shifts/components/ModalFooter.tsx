'use client';
import { Button } from '@/components/ui/button';

interface ModalFooterProps {
  onCancel: () => void;
  onSave: () => void;
  cancelText: string;
  saveText: string;
}

export default function ModalFooter({
  onCancel,
  onSave,
  cancelText,
  saveText
}: ModalFooterProps) {
  return (
    <div className='flex flex-row gap-3  '>
      <Button
        variant='outline'
        onClick={onCancel}
        aria-label={cancelText}
        className='w-full sm:w-auto px-6 py-2 border hover:bg-accent transition-all duration-200'
      >
        {cancelText}
      </Button>
      <Button
        onClick={onSave}
        aria-label={saveText}
        className='w-full sm:w-auto px-6 py-2 bg-primary hover:bg-primary/90 transition-all duration-200'
      >
        {saveText}
      </Button>
    </div>
  );
}
