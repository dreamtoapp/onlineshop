"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { updateDriverLocation } from '../action/trackDriver';

interface DriverTrackerProps {
  driverId: string;
  orderId: string;
  intervalMinutes?: number;
}

export default function DriverTracker({
  driverId,
  orderId,
  intervalMinutes = 15,
}: DriverTrackerProps) {
  // Convert minutes to seconds and store in ref to avoid stale closures
  const intervalSeconds = useRef(intervalMinutes * 60);

  // Time left state
  const [timeLeft, setTimeLeft] = useState(() => intervalSeconds.current);
  const [isUpdating, setIsUpdating] = useState(false);

  // Update ref when prop changes
  useEffect(() => {
    intervalSeconds.current = intervalMinutes * 60;
    setTimeLeft(intervalSeconds.current);
  }, [intervalMinutes]);

  // Countdown timer
  useEffect(() => {
    const tick = () => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : intervalSeconds.current));
    };
    const timerId = setInterval(tick, 1000);
    return () => clearInterval(timerId);
  }, []);

  // Memoized location update function
  const getLocationAndUpdate = useCallback(async () => {
    setIsUpdating(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      await updateDriverLocation({
        driverId,
        orderId,
        latitude: position.coords.latitude.toString() || '',
        longitude: position.coords.longitude.toString() || '',
      });

      setTimeLeft(intervalSeconds.current);
    } catch (error) {
      console.error('Error updating location:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [driverId, orderId]);

  // Initial run and interval for location updates
  useEffect(() => {
    getLocationAndUpdate();
    const locationInterval = setInterval(
      getLocationAndUpdate,
      intervalMinutes * 60 * 1000
    );
    return () => clearInterval(locationInterval);
  }, [getLocationAndUpdate, intervalMinutes]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60).toString().padStart(2, '0');
    const seconds = String(secs % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="rounded-lg bg-gray-100 p-1 text-gray-600">
      <div className="flex items-center gap-4">
        <p className="text-sm">Next update in: {formatTime(timeLeft)}</p>
        {isUpdating && <span className="text-sm text-blue-600">Updating...</span>}
      </div>
    </div>
  );
}

