'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ShiftNameFieldProps {
  name: string;
  onNameChange: (name: string) => void;
  error?: string;
  placeholder: string;
  label: string;
}

export default function ShiftNameField({
  name,
  onNameChange,
  error,
  placeholder,
  label
}: ShiftNameFieldProps) {
  return (
    <div className='space-y-2'>
      <Label htmlFor='shiftName' className='block text-sm font-medium text-foreground'>
        {label}
      </Label>
      <Input
        id='shiftName'
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder={placeholder}
        className='w-full border border-input focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 text-center h-10'
        aria-invalid={!!error}
      />
      {error && (
        <p className='text-xs text-red-500 text-center'>{error}</p>
      )}
    </div>
  );
}
