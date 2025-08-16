// components/ShiftSelector.tsx
'use client';
import {
  useEffect,
  useState,
} from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { getAvailableShifts } from '../actions/shiftActions';
import { Shift } from '@/types/databaseTypes';

interface ShiftSelectorProps {
  selectedShiftId: string;
  onShiftSelect: (selectedShiftId: string) => void;
}

export const ShiftSelector = ({ selectedShiftId, onShiftSelect }: ShiftSelectorProps) => {
  const [shifts, setShifts] = useState<Partial<Shift>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setIsLoading(true);
        setError('');
        const shiftsData = await getAvailableShifts();

        if (!shiftsData || shiftsData.length === 0) {
          setError('لا توجد أوقات توصيل متاحة حالياً');
          return;
        }

        setShifts(shiftsData);

        // Auto-select first shift if none selected
        if (shiftsData.length > 0 && !selectedShiftId) {
          onShiftSelect(shiftsData[0].id!);
        }
      } catch (err) {
        console.error('Error fetching shifts:', err);
        setError('فشل تحميل أوقات التوصيل. يرجى المحاولة مرة أخرى');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShifts();
  }, [onShiftSelect, selectedShiftId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Select value={selectedShiftId} onValueChange={onShiftSelect}>
        <SelectTrigger className="h-12 bg-background">
          <SelectValue placeholder="اختر وقت التوصيل المناسب" />
        </SelectTrigger>
        <SelectContent>
          {shifts.filter(shift => shift.id).map((shift) => (
            <SelectItem
              key={shift.id}
              value={shift.id!}
              className="py-3"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {shift.startTime} - {shift.endTime}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Selected Shift Info */}
      {selectedShiftId && (
        <Card className="bg-feature-commerce-soft/20 border-feature-commerce/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-feature-commerce">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">وقت التوصيل المحدد</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {(() => {
                const selectedShift = shifts.find(s => s.id === selectedShiftId);
                if (!selectedShift) return '';
                return `سيتم توصيل طلبك بين ${selectedShift.startTime} و ${selectedShift.endTime}`;
              })()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Info */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• يتم التوصيل خلال الوقت المحدد</p>
        <p>• سيتم التواصل معك قبل الوصول</p>
        <p>• يمكن تغيير وقت التوصيل حتى ساعتين قبل الموعد</p>
      </div>
    </div>
  );
};
