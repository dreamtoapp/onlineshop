"use client";
import QuickActions from '../components/QuickActions';
import dynamic from 'next/dynamic';
const PusherNotify = dynamic(() => import('@/app/dashboard/management/PusherNotify'), { ssr: false });

export default function DashboardClientHeader() {
    return (
        <div className='flex items-center gap-3'>
            <QuickActions />
            <PusherNotify />
        </div>
    );
} 