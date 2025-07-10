import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { UserRole } from '@prisma/client';

import { getUsers } from '../shared/actions/getUsers';
import UserCard from '../shared/components/UserCard';
import AddUser from '../shared/components/UserUpsert';

export default async function DriversPage() {
  const drivers = await getUsers(UserRole.DRIVER);

  if (!drivers) {
    notFound();
  }

  return (
    <div className='space-y-6 bg-background p-6 text-foreground'>
      {/* Page Title */}

      <div className='flex items-center justify-between'>


        <div className='flex items-center gap-4'>
          <h1 className='text-3xl font-bold text-primary'>ادارة السائقين</h1>
          <Badge variant="outline">{drivers.length}</Badge>
        </div>
        <AddUser
          role={UserRole.DRIVER}
          mode='new'
          title={"إضافة سائق"}
          description={"يرجى إدخال بيانات السائق"}
          defaultValues={{
            name: '',
            email: '',
            phone: '',
            address: '',
            password: '',
            sharedLocationLink: '',
            latitude: '',
            longitude: '',
            vehicleType: undefined,
            vehiclePlateNumber: '',
            vehicleColor: '',
            vehicleModel: '',
            driverLicenseNumber: '',
            experience: '',
            maxOrders: '3',
          }} />
      </div>




      {/* Driver List */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {drivers.length > 0 ? (
          drivers.map((driver) => <UserCard key={driver.id} driver={{
            ...driver,
            name: driver.name || '',
          }} />)
        ) : (
          <div className='col-span-full text-center text-muted-foreground'>
            لا يوجد سائقون متاحون. يرجى إضافة سائق جديد.
          </div>
        )}
      </div>
    </div>
  );
}
