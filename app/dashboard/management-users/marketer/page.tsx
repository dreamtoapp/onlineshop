import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { UserRole } from '@prisma/client';

import { getUsers } from '../shared/actions/getUsers';
import UserCard from '../shared/components/UserCard';
import AddUser from '../shared/components/UserUpsert';

export default async function MarketerPage() {
  const marketers = await getUsers(UserRole.MARKETER);

  if (!marketers) {
    notFound();
  }

  return (
    <div className='space-y-6 bg-background p-6 text-foreground'>
      {/* Page Title */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h1 className='text-3xl font-bold text-primary'>ادارة المسوقين</h1>
          <Badge variant="outline">{marketers.length}</Badge>
        </div>
        <AddUser
          role={UserRole.MARKETER}
          mode='new'
          title={"إضافة مسوق"}
          description={"يرجى إدخال بيانات المسوق"}
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
        {marketers.length > 0 ? (
          marketers.map((marketer) => <UserCard key={marketer.id} driver={{
            ...marketer,
            name: marketer.name || '',
          }} />)
        ) : (
          <div className='col-span-full text-center text-muted-foreground'>
            لا يوجد مسوقون متاحون. يرجى إضافة مسوق جديد.
          </div>
        )}
      </div>
    </div>
  );
}
