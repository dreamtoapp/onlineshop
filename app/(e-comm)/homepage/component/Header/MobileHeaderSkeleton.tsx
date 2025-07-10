import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const MobileHeaderSkeleton = React.memo(function MobileHeaderSkeleton() {
    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6 relative">
            {/* User menu skeleton (left) */}
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>

            {/* Logo skeleton (center) */}
            <div className="flex-1 flex justify-center">
                <Skeleton className="h-[30px] w-[120px] rounded-full" />
            </div>

            {/* Actions skeleton (right) */}
            <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
        </header>
    );
});

export default MobileHeaderSkeleton; 