'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, AddressInput } from '../helpers';
import { getAddressFromLatLng } from '@/lib/getAddressFromLatLng';
import { toast } from 'sonner';
import { ERROR_MESSAGES } from '../helpers';
import { AddressFormHeader } from './AddressFormHeader';
import { AddressFormFields } from './AddressFormFields';
import { AddressFormFooter } from './AddressFormFooter';

interface AddressFormProps {
    address?: AddressInput;
    onSubmit: (data: AddressInput) => void;
    onCancel: () => void;
}

export default function AddressForm({ address, onSubmit, onCancel }: AddressFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isOptionalOpen, setIsOptionalOpen] = useState(false);
    const [locationDetected, setLocationDetected] = useState(false);
    const [locationError, setLocationError] = useState(false);
    const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
    const [isExtractionDialogOpen, setIsExtractionDialogOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(addressSchema),
        defaultValues: address || {
            label: 'المنزل',
            district: '',
            street: '',
            buildingNumber: '',
            floor: '',
            apartmentNumber: '',
            landmark: '',
            deliveryInstructions: '',
            latitude: '',
            longitude: '',
            isDefault: false,
        },
    });

    const handleFormSubmit = async (data: AddressInput) => {
        console.log('Form submission started with data:', data); // Debug log
        setIsSubmitting(true);
        try {
            await onSubmit(data);
            console.log('Form submission successful'); // Debug log
        } catch (error) {
            console.error('Error submitting address:', error);
            toast.error(ERROR_MESSAGES.CREATE_FAILED);
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmitForm = handleSubmit(handleFormSubmit);

    // Add logging to see form state
    console.log('Form errors:', errors);
    console.log('Form values:', watch());

    const handleDetectLocation = useCallback(async () => {
        setLoading(true);
        setLocationDetected(false);
        setLocationError(false);
        setLocationAccuracy(null);
        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000,
                });
            });

            const { latitude, longitude, accuracy } = position.coords;
            setValue('latitude', latitude.toString());
            setValue('longitude', longitude.toString());
            setLocationAccuracy(accuracy);

            const addressData = await getAddressFromLatLng(latitude, longitude);
            if (addressData && addressData.address) {
                setLocationDetected(true);
            } else {
                setLocationError(true);
            }
        } catch (error) {
            console.error('Error detecting location:', error);
            setLocationError(true);
        } finally {
            setLoading(false);
        }
    }, [setValue]);

    // Auto-detect location when component mounts
    useEffect(() => {
        if (!address?.latitude && !address?.longitude) {
            handleDetectLocation();
        }
    }, [address?.latitude, address?.longitude, handleDetectLocation]);

    const handleCoordinatesExtracted = async (coords: { lat: number; lng: number }) => {
        try {
            const { lat, lng } = coords;

            // Update form coordinates
            setValue('latitude', lat.toString());
            setValue('longitude', lng.toString());

            // Try to get address from new coordinates
            const addressData = await getAddressFromLatLng(lat, lng);
            if (addressData && addressData.address) {
                // Address data available but not auto-filling fields
            }

            // Update location states
            setLocationDetected(true);
            setLocationError(false);
            setLocationAccuracy(5); // Assume high accuracy for manual extraction
        } catch (error) {
            console.error('Error applying extracted coordinates:', error);
            toast.error('حدث خطأ أثناء تحديث الإحداثيات');
        }
    };

    return (
        <form onSubmit={onSubmitForm} className="max-h-[80vh] flex flex-col">
            {/* Form Header */}
            <AddressFormHeader
                label={watch('label')}
                onLabelChange={(value) => setValue('label', value)}
                latitude={watch('latitude') || ''}
                longitude={watch('longitude') || ''}
                loading={loading}
                locationDetected={locationDetected}
                locationError={locationError}
                locationAccuracy={locationAccuracy}
                onDetectLocation={handleDetectLocation}
                isExtractionDialogOpen={isExtractionDialogOpen}
                onExtractionDialogChange={setIsExtractionDialogOpen}
                onCoordinatesExtracted={handleCoordinatesExtracted}
            />

            {/* Form Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
                <AddressFormFields
                    register={register}
                    errors={errors}
                    isOptionalOpen={isOptionalOpen}
                    onOptionalOpenChange={setIsOptionalOpen}
                />
            </div>

            {/* Form Footer */}
            <AddressFormFooter
                isSubmitting={isSubmitting}
                onCancel={onCancel}
                address={address}
            />
        </form>
    );
} 