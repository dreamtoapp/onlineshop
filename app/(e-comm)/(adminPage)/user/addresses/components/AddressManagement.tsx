'use client';

import { useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { getAddresses, deleteAddress, setDefaultAddress, createAddress, updateAddress } from '../actions/addressActions';
import { toast } from 'sonner';

import { AddressInput } from '../helpers';
import AddressHeader from './AddressHeader';
import EmptyAddressState from './EmptyAddressState';
import AddressList from './AddressList';
import AddressFormDialog from './AddressFormDialog';
import { useAddressState, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../helpers';


interface AddressManagementProps {
    userId: string;
}

export default function AddressManagement({ userId }: AddressManagementProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const {
        addresses,
        loading,
        isDialogOpen,
        editingAddress,
        showDefaultDeleteAlert,
        settingDefaultId,
        setAddresses,
        setLoading,
        openDialog,
        closeDialog,

        setShowDefaultDeleteAlert,
        setSettingDefaultId,
        handleAddAddress,
        handleEditAddress,
        handleCancelEdit,
    } = useAddressState();

    const loadAddresses = useCallback(async () => {
        try {
            setLoading(true);
            const result = await getAddresses(userId);
            if (result.success) {
                // Transform undefined values to null for Prisma type compatibility
                const transformedAddresses = result.addresses.map(addr => ({
                    ...addr,
                    floor: addr.floor || null,
                    apartmentNumber: addr.apartmentNumber || null,
                    landmark: addr.landmark || null,
                    deliveryInstructions: addr.deliveryInstructions || null,
                    latitude: addr.latitude || null,
                    longitude: addr.longitude || null,
                }));
                setAddresses(transformedAddresses);
            } else {
                toast.error(result.message || ERROR_MESSAGES.FETCH_FAILED);
            }
        } catch (error) {
            console.error('Error loading addresses:', error);
            toast.error(ERROR_MESSAGES.FETCH_FAILED);
        } finally {
            setLoading(false);
        }
    }, [userId, setAddresses, setLoading]);

    useEffect(() => {
        loadAddresses();

        // Check for welcome message from registration
        const welcome = searchParams.get('welcome');
        const message = searchParams.get('message');
        if (welcome === 'true' && message) {
            toast.success(message);
        }
    }, [searchParams, loadAddresses]);

    const handleDeleteAddress = async (addressId: string) => {
        const address = addresses.find(a => a.id === addressId);
        if (address?.isDefault) {
            toast.error('لا يمكن حذف العنوان الافتراضي. يرجى تعيين عنوان افتراضي آخر أولاً.');
            return;
        }
        try {
            const result = await deleteAddress(addressId);
            if (result.success) {
                toast.success(SUCCESS_MESSAGES.ADDRESS_DELETED);
                loadAddresses();
            } else {
                toast.error(result.message || ERROR_MESSAGES.DELETE_FAILED);
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            toast.error(ERROR_MESSAGES.DELETE_FAILED);
        }
    };

    const handleSetDefault = async (addressId: string) => {
        setSettingDefaultId(addressId);
        try {
            const result = await setDefaultAddress(addressId);
            if (result.success) {
                toast.success(SUCCESS_MESSAGES.ADDRESS_SET_DEFAULT);
                loadAddresses();
            } else {
                toast.error(result.message || ERROR_MESSAGES.SET_DEFAULT_FAILED);
            }
        } catch (error) {
            console.error('Error setting default address:', error);
            toast.error(ERROR_MESSAGES.SET_DEFAULT_FAILED);
        } finally {
            setSettingDefaultId(null);
        }
    };

    const handleFormSubmit = async (data: AddressInput) => {
        try {
            if (editingAddress) {
                // Update existing address
                const result = await updateAddress(editingAddress.id, data);
                if (result.success) {
                    toast.success(SUCCESS_MESSAGES.ADDRESS_UPDATED);
                    loadAddresses();
                } else {
                    toast.error(result.message || ERROR_MESSAGES.UPDATE_FAILED);
                    return; // Don't close dialog on error
                }
            } else {
                // Create new address
                const result = await createAddress(userId, data);
                if (result.success) {
                    toast.success(SUCCESS_MESSAGES.ADDRESS_CREATED);
                    loadAddresses();
                } else {
                    toast.error(result.message || ERROR_MESSAGES.CREATE_FAILED);
                    return; // Don't close dialog on error
                }
            }

            // Only close dialog on success
            closeDialog();
            const redirectTo = searchParams.get('redirect');
            if (redirectTo) {
                router.push(redirectTo);
            }
        } catch (error) {
            console.error('Error submitting address:', error);
            toast.error(editingAddress ? ERROR_MESSAGES.UPDATE_FAILED : ERROR_MESSAGES.CREATE_FAILED);
        }
    };

    const handleFormCancel = () => {
        handleCancelEdit();
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AddressHeader onAddAddress={handleAddAddress} />

            {addresses.length === 0 ? (
                <EmptyAddressState onAddAddress={handleAddAddress} />
            ) : (
                <AddressList
                    addresses={addresses}
                    onEdit={handleEditAddress}
                    onDelete={handleDeleteAddress}
                    onSetDefault={handleSetDefault}
                    settingDefaultId={settingDefaultId}
                    showDefaultDeleteAlert={showDefaultDeleteAlert}
                    onShowDefaultDeleteAlert={setShowDefaultDeleteAlert}
                />
            )}

            <AddressFormDialog
                isOpen={isDialogOpen}
                onOpenChange={(open) => open ? openDialog() : closeDialog()}
                editingAddress={editingAddress}
                userId={userId}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
            />
        </div>
    );
} 