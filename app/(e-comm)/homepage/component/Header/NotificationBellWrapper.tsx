'use client';
import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type NotificationBell from './NotificationBell';

const NotificationBellClient = dynamic(() => import('./NotificationBell'), { ssr: false });

type NotificationBellProps = ComponentProps<typeof NotificationBell>;

export default function NotificationBellWrapper(props: NotificationBellProps) {
    return <NotificationBellClient {...props} />;
} 