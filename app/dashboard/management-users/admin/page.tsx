import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { UserRole } from '@prisma/client';

import { getUsers } from '../shared/actions/getUsers';
import UserCard from '../shared/components/UserCard';
import AddUser from '../shared/components/UserUpsert';

export default async function AdminPage() {
  const admins = await getUsers(UserRole.ADMIN);

  if (!admins) {
    notFound();
  }

  return (
    <div className='space-y-6 bg-background p-6 text-foreground'>
      {/* Page Title */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h1 className='text-3xl font-bold text-primary'>ادارة المشرفين</h1>
          <Badge variant="outline">{admins.length}</Badge>
        </div>
        <AddUser
          role={UserRole.ADMIN}
          mode='new'
          title={"إضافة مشرف"}
          description={"يرجى إدخال بيانات المشرف"}
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
        {admins.length > 0 ? (
          admins.map((admin) => <UserCard key={admin.id} driver={{
            ...admin,
            name: admin.name || '',
          }} />)
        ) : (
          <div className='col-span-full text-center text-muted-foreground'>
            لا يوجد مشرفون متاحون. يرجى إضافة مشرف جديد.
          </div>
        )}
      </div>
    </div>
  );
}
