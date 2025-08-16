'use client';

/**
 * Custom hook for managing address-related state and operations
 */

import { useState, useCallback } from 'react';
import type { Address } from '@prisma/client';

interface UseAddressStateReturn {
  // State
  addresses: Address[];
  loading: boolean;
  isDialogOpen: boolean;
  editingAddress: Address | null;
  showDefaultDeleteAlert: boolean;
  settingDefaultId: string | null;

  // Actions
  setAddresses: (addresses: Address[]) => void;
  setLoading: (loading: boolean) => void;
  openDialog: () => void;
  closeDialog: () => void;
  setEditingAddress: (address: Address | null) => void;
  setShowDefaultDeleteAlert: (show: boolean) => void;
  setSettingDefaultId: (id: string | null) => void;

  // Convenience methods
  handleAddAddress: () => void;
  handleEditAddress: (address: Address) => void;
  handleCancelEdit: () => void;
}

export const useAddressState = (): UseAddressStateReturn => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showDefaultDeleteAlert, setShowDefaultDeleteAlert] = useState(false);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  const openDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const handleAddAddress = useCallback(() => {
    setEditingAddress(null);
    openDialog();
  }, [openDialog]);

  const handleEditAddress = useCallback((address: Address) => {
    setEditingAddress(address);
    openDialog();
  }, [openDialog]);

  const handleCancelEdit = useCallback(() => {
    setEditingAddress(null);
    closeDialog();
  }, [closeDialog]);

  return {
    // State
    addresses,
    loading,
    isDialogOpen,
    editingAddress,
    showDefaultDeleteAlert,
    settingDefaultId,

    // Actions
    setAddresses,
    setLoading,
    openDialog,
    closeDialog,
    setEditingAddress,
    setShowDefaultDeleteAlert,
    setSettingDefaultId,

    // Convenience methods
    handleAddAddress,
    handleEditAddress,
    handleCancelEdit,
  };
};
