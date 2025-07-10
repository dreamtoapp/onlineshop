'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MousePointerBan, UserCheck } from 'lucide-react';

interface TabsWrapperProps {
    children: React.ReactNode;
    pendingCount: number;
    assignedCount: number;
}

export default function TabsWrapper({
    children,
    pendingCount,
    assignedCount
}: TabsWrapperProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeTab = searchParams.get('tab') || 'pending';

    const handleTabChange = (newTab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', newTab);
        params.set('page', '1'); // Reset to page 1 when changing tabs
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="pending" className="flex items-center gap-2">
                    <MousePointerBan className="h-4 w-4" />
                    قيد الانتظار ({pendingCount})
                </TabsTrigger>
                <TabsTrigger value="assigned" className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    مُخصصة للسائقين ({assignedCount})
                </TabsTrigger>
            </TabsList>

            {children}
        </Tabs>
    );
}

// TODO: Next version enhancements for TabsWrapper
// - Add tab badges showing live counts that update in real-time
// - Implement tab keyboard navigation (Arrow keys, Enter, Space)
// - Add tab context menus with additional actions
// - Implement tab drag-and-drop reordering
// - Add tab persistence (remember last active tab)
// - Implement tab lazy loading for performance
// - Add tab animations and transitions
// - Implement tab overflow handling for mobile
// - Add tab search/filter functionality
// - Implement tab grouping for related order types 