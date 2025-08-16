import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

export default function Loading() {
  return (
    <div className='mx-auto max-w-6xl space-y-6 rounded-lg bg-background p-6 shadow-md'>
      {/* Header */}
      <Skeleton className='mx-auto h-9 w-48' />

      {/* Add Shift Button - Loading state */}
      <div className='flex justify-end'>
        <Skeleton className='h-10 w-40' />
      </div>

      {/* Loading Shifts */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className='transition-all duration-300'>
            <CardHeader>
              <Skeleton className='h-6 w-24' />
              <Skeleton className='h-4 w-32' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-4 w-28' />
            </CardContent>
            <CardFooter>
              <Skeleton className='h-9 w-16' />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
