import { format, parse } from 'date-fns';
import { ar } from 'date-fns/locale';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Shift } from '@/types/databaseTypes';

// دالة لتحويل التوقيت إلى تنسيق عربي
const formatTimeToArabic = (time: string) => {
  const [hours, minutes] = time.split(':');
  const period = Number(hours) >= 12 ? 'مساءً' : 'صباحاً';
  const formattedHours = Number(hours) % 12 || 12; // تحويل إلى 12 ساعة
  return `${formattedHours}:${minutes} ${period}`;
};

interface ShiftCardProps {
  shift: Partial<Shift>;
  onDelete: (id: string) => void;
  deleteButtonText: string;
  shiftDurationText: string;
}

export default function ShiftCard({
  shift,
  onDelete,
  deleteButtonText,
  shiftDurationText
}: ShiftCardProps) {
  const start = parse(shift.startTime!, 'HH:mm', new Date());
  const end = parse(shift.endTime!, 'HH:mm', new Date());

  return (
    <Card className='transition-all duration-300 hover:border-primary hover:shadow-lg'>
      <CardHeader>
        <CardTitle>{shift.name}</CardTitle>
        <CardDescription>
          {formatTimeToArabic(format(start, 'hh:mm a', { locale: ar }))} -{' '}
          {formatTimeToArabic(format(end, 'hh:mm a', { locale: ar }))}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          {shiftDurationText}:{' '}
          {Math.abs((end.getTime() - start.getTime()) / (1000 * 60 * 60)).toFixed(2)} ساعات
        </p>
      </CardContent>
      <CardFooter>
        <Button
          variant='destructive'
          size='sm'
          onClick={() => onDelete(shift.id!)}
          aria-label={`${deleteButtonText} ${shift.name}`}
        >
          {deleteButtonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
