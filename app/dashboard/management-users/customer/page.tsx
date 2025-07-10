import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { UserRole } from '@prisma/client';

import { getUsers } from '../shared/actions/getUsers';
import UserCard from '../shared/components/UserCard';
import AddUser from '../shared/components/UserUpsert';

export default async function CustomerPage() {
  const customers = await getUsers(UserRole.CUSTOMER);

  if (!customers) {
    notFound();
  }

  return (
    <div className='space-y-6 bg-background p-6 text-foreground'>
      {/* Page Title */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h1 className='text-3xl font-bold text-primary'>ادارة العملاء</h1>
          <Badge variant="outline">{customers.length}</Badge>
        </div>
        <AddUser
          role={UserRole.CUSTOMER}
          mode='new'
          title={"إضافة عميل"}
          description={"يرجى إدخال بيانات العميل"}
          defaultValues={{
            name: '',
            email: '',
            phone: '',
            address: '',
            password: '',
            sharedLocationLink: '',
            latitude: '',
            longitude: '',
          }} />
      </div>




      {/* Driver List */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {customers.length > 0 ? (
          customers.map((customer) => <UserCard key={customer.id} driver={{
            ...customer,
            name: customer.name || '',
          }} />)
        ) : (
          <div className='col-span-full text-center text-muted-foreground'>
            لا يوجد عملاء متاحون. يرجى إضافة عميل جديد.
          </div>
        )}
      </div>
    </div>
  );
}
