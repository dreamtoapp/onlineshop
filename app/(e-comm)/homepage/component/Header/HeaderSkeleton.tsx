import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const HeaderSkeleton = React.memo(function HeaderSkeleton() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border/60 shadow-xl shadow-black/10 dark:shadow-black/30 transition-all duration-300 supports-[backdrop-filter]:bg-background/80 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-50" />

            <div className='relative'>
                <nav className='mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8'>
                    {/* Logo skeleton */}
                    <div className='flex flex-shrink-0 items-center ml-2 md:ml-0'>
                        <Skeleton className="h-[30px] w-[120px] md:h-[40px] md:w-[160px] rounded-full" />
                    </div>

                    {/* Search Bar skeleton */}
                    <div className='flex flex-1 items-center justify-center px-2 md:px-6'>
                        <div className='w-full max-w-xl relative'>
                            <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                    </div>

                    {/* Actions skeleton */}
                    <div className='flex items-center gap-4 md:gap-6'>
                        {/* Wishlist skeleton */}
                        <Skeleton className="h-9 w-9 rounded-lg" />

                        {/* Cart skeleton */}
                        <Skeleton className="h-9 w-9 rounded-lg" />

                        {/* Notification skeleton */}
                        <Skeleton className="h-9 w-9 rounded-lg" />

                        {/* User menu skeleton */}
                        <Skeleton className="h-9 w-9 rounded-full" />
                    </div>
                </nav>
            </div>

            {/* Subtle bottom border with gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </header>
    );
});

export default HeaderSkeleton; 