import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';

import { getAdmins } from './actions/getAdmins';
import AdminCard from './components/AdminCard';
import AdminUpsert from './components/AdminUpsert';

export default async function AdminPage() {
  const admins = await getAdmins();

  if (!admins) {
    notFound();
  }

  return (
    <div className='space-y-6 bg-background p-6 text-foreground'>
      {/* Page Title */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h1 className='text-3xl font-bold text-purple-700'>ادارة المشرفين</h1>
          <Badge variant="outline" className="border-purple-200 text-purple-700">{admins.length}</Badge>
        </div>
        <AdminUpsert
          mode='new'
          title="إضافة مشرف جديد"
          description="يرجى إدخال بيانات المشرف"
          defaultValues={{
            name: '',
            email: '',
            phone: '',
            addressLabel: 'العمل',
            district: '',
            street: '',
            buildingNumber: '',
            floor: '',
            apartmentNumber: '',
            landmark: '',
            deliveryInstructions: '',
            password: '',
            sharedLocationLink: '',
            latitude: '',
            longitude: '',
            adminLevel: 'ADMIN',
            permissions: [],
            isActive: true,
          }} />
      </div>

      {/* Admin List */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {admins.length > 0 ? (
          admins.map((admin) => (
            <AdminCard key={admin.id} admin={{
              ...admin,
              name: admin.name || '',
            }} />
          ))
        ) : (
          <div className='col-span-full text-center text-muted-foreground'>
            لا يوجد مشرفون متاحون. يرجى إضافة مشرف جديد.
          </div>
        )}
      </div>
    </div>
  );
}
