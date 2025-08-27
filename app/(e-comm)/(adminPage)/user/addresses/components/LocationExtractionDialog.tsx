'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Link } from 'lucide-react';
import { extractCoordinatesFromUrl, isValidSharedLocationLink } from '@/utils/extract-latAndLog-fromWhatsAppLink';
import { toast } from 'sonner';
import { SUCCESS_MESSAGES } from '../helpers';

interface LocationExtractionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCoordinatesExtracted?: (coords: { lat: number; lng: number }) => void;
}

export function LocationExtractionDialog({
  open,
  onOpenChange,
  onCoordinatesExtracted
}: LocationExtractionDialogProps) {
  const [extractionUrl, setExtractionUrl] = useState('');
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [extractedCoordinates, setExtractedCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const handleManualExtraction = async () => {
    if (!isValidSharedLocationLink(extractionUrl)) {
      setExtractionError('الرابط غير صالح. الرجاء لصق رابط موقع Google Maps أو واتساب صحيح.');
      return;
    }

    const coords = extractCoordinatesFromUrl(extractionUrl);
    if (!coords) {
      setExtractionError('تعذر استخراج الإحداثيات من الرابط.');
      return;
    }

    setExtractionError(null);
    setExtractedCoordinates(coords);
  };

  const applyExtractedCoordinates = async () => {
    if (!extractedCoordinates) return;

    try {
      // Call the parent callback if provided
      if (onCoordinatesExtracted) {
        onCoordinatesExtracted(extractedCoordinates);
      }

      // Close dialog and show success
      onOpenChange(false);
      toast.success(SUCCESS_MESSAGES.COORDINATES_EXTRACTED);

      // Reset extraction states
      setExtractionUrl('');
      setExtractedCoordinates(null);
      setExtractionError(null);
    } catch (error) {
      console.error('Error applying extracted coordinates:', error);
      toast.error('حدث خطأ أثناء تحديث الإحداثيات');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full flex items-center gap-2 text-xs"
        >
          <Link className="h-3 w-3" />
          استخراج من رابط الموقع
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            استخراج الإحداثيات من الرابط
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">الصق رابط الموقع من واتساب أو Google Maps</Label>
            <Input
              type="text"
              placeholder="ألصق رابط الموقع هنا..."
              value={extractionUrl}
              onChange={(e) => setExtractionUrl(e.target.value)}
              className="w-full"
            />
            {extractionError && (
              <p className="text-sm text-red-500">{extractionError}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleManualExtraction}
              className="flex-1"
              disabled={!extractionUrl.trim()}
            >
              استخراج الإحداثيات
            </Button>
          </div>

          {extractedCoordinates && (
            <div className="space-y-3 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">الإحداثيات المستخرجة:</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">عرض:</Label>
                  <div className="text-sm font-mono bg-background px-2 py-1 rounded border">
                    {extractedCoordinates.lat.toFixed(7)}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">طول:</Label>
                  <div className="text-sm font-mono bg-background px-2 py-1 rounded border">
                    {extractedCoordinates.lng.toFixed(7)}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={applyExtractedCoordinates}
                  className="flex-1"
                  size="sm"
                >
                  تطبيق الإحداثيات الجديدة
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setExtractedCoordinates(null);
                    setExtractionUrl('');
                    setExtractionError(null);
                  }}
                  size="sm"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}














