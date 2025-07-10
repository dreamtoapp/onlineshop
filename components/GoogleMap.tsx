'use client';
import { useState } from 'react';

import { Icon } from '@/components/icons/Icon';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';


interface MapProps {
  latitude?: string | '';
  longitude?: string | '';
  zoom?: number;
}

const GoogleMap = ({ latitude, longitude, }: MapProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Check if valid coordinates are provided
  const isLatitudeValid =
    latitude !== undefined && latitude !== null && latitude !== '' && parseFloat(latitude) >= -90 && parseFloat(latitude) <= 90;
  const isLongitudeValid =
    longitude !== undefined && longitude !== null && longitude !== '' && parseFloat(longitude) >= -180 && parseFloat(longitude) <= 180;
  const hasValidCoordinates = isLatitudeValid && isLongitudeValid;

  // Construct a Google Maps embed URL for high-accuracy display without API key
  const mapUrl = hasValidCoordinates
    ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=18&output=embed`
    : '';

  return (
    <div>
      {/* Button to Open Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={!hasValidCoordinates}
            variant='outline'
            className='flex items-center gap-2'
          >
            {hasValidCoordinates ? (
              <Icon name="Map" size="sm" />
            ) : (
              <Icon name="MapPinOff" size="sm" />
            )}
          </Button>
        </DialogTrigger>

        {/* Dialog Content */}
        <DialogContent className='sm:max-w-[800px]'>
          <DialogHeader>
            <DialogTitle>عرض الموقع</DialogTitle>
          </DialogHeader>

          {/* Map Display */}
          {hasValidCoordinates ? (
            <div className='h-[400px] w-full'>
              <iframe
                title='Google Map Location'
                src={mapUrl}
                width='100%'
                height='400'
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
              />
            </div>
          ) : (
            <div className='text-red-500'>Invalid coordinates provided.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoogleMap;
