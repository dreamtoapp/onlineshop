import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { auth } from '@/auth';
import { getUserReviews } from '@/app/(e-comm)/(home-page-sections)/product/actions/rating';
import RatingsClient from './components/RatingsClient';

export const metadata = {
    title: 'تقييماتي ومراجعاتي | المتجر الإلكتروني',
    description: 'عرض وإدارة تقييماتك للمنتجات والسائقين والتطبيق',
};

// Mockup data for Phase 1
const MOCKUP_DRIVER_RATINGS = [
    {
        id: '1',
        orderId: 'ORD-2024-001',
        driverName: 'أحمد محمد',
        rating: 5,
        comment: 'سائق محترم ووصل في الوقت المحدد. خدمة ممتازة!',
        createdAt: new Date('2024-01-15'),
        deliveryTime: '30 دقيقة',
        orderTotal: 150.00
    },
    {
        id: '2',
        orderId: 'ORD-2024-002',
        driverName: 'عبدالله أحمد',
        rating: 4,
        comment: 'سائق جيد لكن تأخر قليلاً عن الموعد',
        createdAt: new Date('2024-01-10'),
        deliveryTime: '45 دقيقة',
        orderTotal: 89.50
    }
];

const MOCKUP_APP_RATINGS = [
    {
        id: '1',
        orderId: 'ORD-2024-001',
        rating: 5,
        comment: 'تطبيق رائع وسهل الاستخدام. تجربة تسوق ممتازة!',
        createdAt: new Date('2024-01-20'),
        category: 'تجربة المستخدم'
    },
    {
        id: '2',
        orderId: 'ORD-2024-003',
        rating: 4,
        comment: 'التطبيق جيد بشكل عام، لكن يحتاج تحسين في سرعة التحميل',
        createdAt: new Date('2024-01-12'),
        category: 'أداء التطبيق'
    }
];

// Loading component
function RatingsLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-40 bg-muted rounded-lg" />
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-32 bg-muted rounded-lg" />
        </div>
    );
}

export default async function RatingsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/auth/signin');
    }

    // Get real product reviews
    const productReviews = await getUserReviews(session.user.id);

    // Use mockup data for driver and app ratings (Phase 1)
    const driverRatings = MOCKUP_DRIVER_RATINGS;
    const appRatings = MOCKUP_APP_RATINGS;

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Main Content */}
            <Suspense fallback={<RatingsLoading />}>
                <RatingsClient
                    productReviews={productReviews}
                    driverRatings={driverRatings}
                    appRatings={appRatings}
                />
            </Suspense>
        </div>
    );
} 