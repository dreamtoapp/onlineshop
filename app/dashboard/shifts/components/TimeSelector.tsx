'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface TimeSelectorProps {
  time: string;
  onTimeChange: (time: string) => void;
  label: string;
}

export default function TimeSelector({ time, onTimeChange, label }: TimeSelectorProps) {
  const handleHourChange = (hour: string) => {
    const currentHour = time ? time.split(':')[0] || '00' : '00';
    const minute = time ? time.split(':')[1] || '00' : '00';
    const isPM = Number(currentHour) >= 12;
    const newHour = isPM ? (Number(hour) + 12).toString().padStart(2, '0') : hour.padStart(2, '0');
    onTimeChange(`${newHour}:${minute}`);
  };

  const handleMinuteChange = (minute: string) => {
    const hour = time ? time.split(':')[0] || '00' : '00';
    onTimeChange(`${hour}:${minute.padStart(2, '0')}`);
  };

  const handlePeriodChange = (isPM: boolean) => {
    const [hour, minute] = (time || '00:00').split(':');
    let newHour: string;

    if (isPM) {
      newHour = Number(hour) >= 12 ? hour : (Number(hour) + 12).toString().padStart(2, '0');
    } else {
      newHour = Number(hour) < 12 ? hour : (Number(hour) - 12).toString().padStart(2, '0');
    }

    onTimeChange(`${newHour}:${minute}`);
  };

  const isPM = time ? Number(time.split(':')[0]) >= 12 : false;

  return (
    <div className='space-y-2'>
      <Label className='block text-sm font-medium text-foreground'>{label}</Label>
      <div className='flex items-end justify-center space-x-8 '>
        {/* Time Selects */}
        <div className='flex items-center gap-2 space-x-3'>
          <div className='flex flex-col items-center space-y-1'>
            <span className='text-xs text-muted-foreground'>الساعة</span>
            <Select
              value={time ? (Number(time.split(':')[0]) % 12 || 12).toString() : '12'}
              onValueChange={handleHourChange}
            >
              <SelectTrigger className='w-16 h-10 text-center text-base font-medium border border-input focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200'>
                <SelectValue placeholder='12' />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {(i + 1).toString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col items-center space-y-1'>
            <span className='text-xs text-muted-foreground'>الدقيقة</span>
            <Select
              value={time ? time.split(':')[1] || '00' : '00'}
              onValueChange={handleMinuteChange}
            >
              <SelectTrigger className='w-16 h-10 text-center text-base font-medium border border-input focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200'>
                <SelectValue placeholder='00' />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 60 }, (_, i) => (
                  <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                    {i.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Period Buttons */}
        <div className='flex items-center justify-center gap-4 '>
          <Button
            type='button'
            variant={!isPM ? 'destructive' : 'secondary'}
            size='sm'
            onClick={() => handlePeriodChange(false)}
            className='px-3 py-2 text-sm font-medium'
          >
            صباحاً
          </Button>
          <Button
            type='button'
            variant={isPM ? 'destructive' : 'secondary'}
            size='sm'
            onClick={() => handlePeriodChange(true)}
            className='px-3 py-2 text-sm font-medium'
          >
            مساءً
          </Button>
        </div>
      </div>
    </div>
  );
}
