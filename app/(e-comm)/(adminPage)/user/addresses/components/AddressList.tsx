import AddressCard from './AddressCard';

import type { Address } from '@prisma/client';

interface AddressListProps {
  addresses: Address[];
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
  settingDefaultId: string | null;
  showDefaultDeleteAlert: boolean;
  onShowDefaultDeleteAlert: (show: boolean) => void;
}

export default function AddressList({
  addresses,
  onEdit,
  onDelete,
  onSetDefault,
  settingDefaultId,
  showDefaultDeleteAlert,
  onShowDefaultDeleteAlert
}: AddressListProps) {
  return (
    <div className="grid gap-4">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
          settingDefaultId={settingDefaultId}
          showDefaultDeleteAlert={showDefaultDeleteAlert}
          onShowDefaultDeleteAlert={onShowDefaultDeleteAlert}
        />
      ))}
    </div>
  );
}
