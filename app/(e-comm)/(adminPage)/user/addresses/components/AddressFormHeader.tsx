'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Loader2 } from 'lucide-react';
import { ACCURACY_THRESHOLDS, ACCURACY_COLORS, ERROR_MESSAGES } from '../helpers';
import { formatCoordinate, formatAccuracy, getAccuracyBadgeColor, generateGoogleMapsUrl } from '../helpers';
import { LocationExtractionDialog } from './LocationExtractionDialog';

interface AddressFormHeaderProps {
  label: string;
  onLabelChange: (value: string) => void;
  latitude: string;
  longitude: string;
  loading: boolean;
  locationDetected: boolean;
  locationError: boolean;
  locationAccuracy: number | null;
  onDetectLocation: () => void;
  isExtractionDialogOpen: boolean;
  onExtractionDialogChange: (open: boolean) => void;
  onCoordinatesExtracted?: (coords: { lat: number; lng: number }) => void;
}

export function AddressFormHeader({
  label,
  onLabelChange,
  latitude,
  longitude,
  loading,
  locationDetected,
  locationError,
  locationAccuracy,
  onDetectLocation,
  isExtractionDialogOpen,
  onExtractionDialogChange,
  onCoordinatesExtracted
}: AddressFormHeaderProps) {
  return (
    <div className="pb-6 border-b border-border flex-shrink-0">
      <div className="flex gap-4">
        {/* Address Type */}
        <div className="flex-1 p-4 bg-card border border-border rounded-lg">
          <div className="space-y-2">
            <Label className="text-sm font-medium">نوع العنوان</Label>
            <Select value={label} onValueChange={onLabelChange}>
              <SelectTrigger className="h-10 focus:border-feature-suppliers">
                <SelectValue placeholder="اختر نوع العنوان" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="المنزل">منزل</SelectItem>
                <SelectItem value="العمل">عمل</SelectItem>
                <SelectItem value="أخرى">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Manual Coordinate Extraction Button */}
          <div className="mt-4">
            <LocationExtractionDialog
              open={isExtractionDialogOpen}
              onOpenChange={onExtractionDialogChange}
              onCoordinatesExtracted={onCoordinatesExtracted}
            />
          </div>
        </div>

        {/* Location Detection Button */}
        <div className="flex-1 p-4 bg-muted border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 flex items-center gap-3 h-10 px-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border hover:border-border/80 transition-all duration-200 rounded-lg"
              onClick={onDetectLocation}
              disabled={loading}
            >
              <MapPin className="h-4 w-4 text-secondary-foreground" />
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-secondary-foreground" />
                  جاري تحديد الموقع...
                </>
              ) : locationDetected ? (
                <>
                  <div className={`w-4 h-4 rounded-full ${locationAccuracy ?
                    (locationAccuracy <= ACCURACY_THRESHOLDS.EXCELLENT ? ACCURACY_COLORS.EXCELLENT :
                      locationAccuracy <= ACCURACY_THRESHOLDS.GOOD ? ACCURACY_COLORS.GOOD :
                        ACCURACY_COLORS.POOR) :
                    ACCURACY_COLORS.EXCELLENT
                    }`}></div>
                  <span className="font-medium">تم تحديد الموقع</span>
                </>
              ) : locationError ? (
                <>
                  <span className="text-red-400 text-lg">✗</span>
                  <span className="font-medium">{ERROR_MESSAGES.LOCATION_DETECTION_FAILED}</span>
                </>
              ) : (
                <>
                  <span className="font-medium">تحديد تلقائي</span>
                </>
              )}
            </Button>
            {locationAccuracy && (
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${locationAccuracy <= ACCURACY_THRESHOLDS.EXCELLENT ? ACCURACY_COLORS.EXCELLENT :
                  locationAccuracy <= ACCURACY_THRESHOLDS.GOOD ? ACCURACY_COLORS.GOOD :
                    ACCURACY_COLORS.POOR
                  }`}></div>
                <span className={`text-xs ${getAccuracyBadgeColor(locationAccuracy)} px-2 py-1 rounded-full`}>
                  {formatAccuracy(locationAccuracy)}
                </span>
              </div>
            )}
          </div>

          {/* Coordinates Display */}
          <div className="mt-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">عرض:</span>
                <span className="text-sm font-mono text-foreground bg-background/50 px-2 py-1 rounded border border-border">
                  {formatCoordinate(latitude)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">طول:</span>
                <span className="text-sm font-mono text-foreground bg-background/50 px-2 py-1 rounded border border-border">
                  {formatCoordinate(longitude)}
                </span>
              </div>
            </div>

            {/* Google Maps Link */}
            {latitude && longitude && (
              <div className="mt-2">
                <a
                  href={generateGoogleMapsUrl(latitude, longitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  عرض على الخريطة
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
