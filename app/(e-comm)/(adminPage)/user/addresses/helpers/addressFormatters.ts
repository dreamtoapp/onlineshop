/**
 * Address formatting utilities for consistent display across the application
 */

/**
 * Formats coordinates to 7 decimal places for display
 */
export const formatCoordinate = (coordinate: string | number | null | undefined): string => {
  if (!coordinate) return '0.0000000';

  const num = typeof coordinate === 'string' ? parseFloat(coordinate) : coordinate;
  if (isNaN(num)) return '0.0000000';

  return num.toFixed(7);
};

/**
 * Formats accuracy distance with Arabic units
 */
export const formatAccuracy = (accuracy: number): string => {
  if (accuracy >= 1000) {
    return `±${(accuracy / 1000).toFixed(1)}ك`;
  }
  return `±${Math.round(accuracy)}م`;
};

/**
 * Gets accuracy color based on distance
 */
export const getAccuracyColor = (accuracy: number): string => {
  if (accuracy <= 15) return 'text-green-400';
  if (accuracy <= 30) return 'text-yellow-400';
  return 'text-red-400';
};

/**
 * Gets accuracy text description
 */
export const getAccuracyText = (accuracy: number): string => {
  if (accuracy <= 15) return 'دقيق';
  if (accuracy <= 30) return 'تحذير';
  return 'حرج';
};

/**
 * Gets accuracy badge color classes
 */
export const getAccuracyBadgeColor = (accuracy: number): string => {
  if (accuracy <= 15) return 'text-green-500 bg-green-500/10';
  if (accuracy <= 30) return 'text-yellow-500 bg-yellow-500/10';
  return 'text-red-500 bg-red-500/10';
};

/**
 * Formats a full address for display
 */
export const formatFullAddress = (address: {
  district: string;
  street: string;
  buildingNumber: string;
  floor?: string | null;
  apartmentNumber?: string | null;
}): string => {
  const parts = [
    address.street,
    address.buildingNumber,
    address.district
  ];

  if (address.floor) {
    parts.splice(2, 0, `الطابق ${address.floor}`);
  }

  if (address.apartmentNumber) {
    parts.splice(3, 0, `شقة ${address.apartmentNumber}`);
  }

  return parts.join('، ');
};

/**
 * Generates Google Maps URL from coordinates
 */
export const generateGoogleMapsUrl = (latitude: string | number | null | undefined, longitude: string | number | null | undefined): string => {
  const lat = latitude ? (typeof latitude === 'string' ? latitude : latitude.toString()) : '0';
  const lng = longitude ? (typeof longitude === 'string' ? longitude : longitude.toString()) : '0';
  return `https://www.google.com/maps?q=${lat},${lng}`;
};
