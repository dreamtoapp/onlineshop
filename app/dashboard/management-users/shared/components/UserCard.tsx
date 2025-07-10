'use client'; // Mark as a Client Component
import { toast } from 'sonner';

import AddImage from '@/components/AddImage';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { UserRole } from '@prisma/client';

import DeleteDriverAlert from './DeleteUser';
import AddUser from './UserUpsert';

type DriverCardProps = {
  driver: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    role: UserRole;
    address?: string | null;
    password?: string | null;
    sharedLocationLink?: string | null;
    image?: string | null;
    latitude?: string | null;
    longitude?: string | null;
  };
};

export default function UserCard({ driver }: DriverCardProps) {
  const safeDriver = {
    ...driver,
    name: driver.name || 'No Name',
    email: driver.email || '',
    password: undefined,
    imageUrl: driver.image || undefined,
  };
  return (
    <Card className='overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-md transition-shadow hover:shadow-lg'>
      {/* Card Header */}
      <CardHeader className='border-b border-border bg-muted/50 p-4'>
        <CardTitle className='line-clamp-1 text-lg font-semibold text-primary'>
          {safeDriver.name}
        </CardTitle>
      </CardHeader>

      {/* Card Content */}
      <CardContent className='space-y-4 p-4'>
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted/20">
          <AddImage
            url={safeDriver.imageUrl}
            alt={`${safeDriver.name}'s profile`}
            recordId={safeDriver.id}
            table="user"
            tableField='image'
            onUploadComplete={() => toast.success("تم رفع الصورة بنجاح")}
          />
        </div>


        {/* Details */}
        <div className='space-y-2'>
          <p className='flex items-center gap-2 text-sm text-muted-foreground'>
            <strong className='font-medium'>Email:</strong> {safeDriver.email || 'No Email'}
          </p>
          <p className='flex items-center gap-2 text-sm text-muted-foreground'>
            <strong className='font-medium'>Phone:</strong> {safeDriver.phone || 'No Phone'}
          </p>
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className='flex justify-between border-t border-border bg-muted/50 p-4'>




        <AddUser
          role={driver.role}
          mode='update'
          title={"تعديل سائق"}
          description={"يرجى إدخال بيانات السائق"}
          defaultValues={{
            name: driver.name,
            email: driver.email || '',
            phone: driver.phone || '',
            address: driver.address || '',
            password: driver.password || '',
            sharedLocationLink: driver.sharedLocationLink || '',
            latitude: driver.latitude || '',
            longitude: driver.longitude || '',
          }} />


        {/* Delete Driver Alert */}
        <DeleteDriverAlert driverId={safeDriver.id}>
          <button className='flex items-center gap-1 text-destructive hover:underline'>
            <Icon name="Trash2" size="xs" />
          </button>
        </DeleteDriverAlert>
      </CardFooter>
    </Card>
  );
}
