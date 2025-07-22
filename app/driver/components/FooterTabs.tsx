"use client";
import { Icon } from '@/components/icons/Icon';
import { useEffect, useState } from 'react';

interface FooterTabsProps {
    assignedOrders: number;
    deliveredOrders: number;
    canceledOrders: number;
    driverId: string;
}

export default function FooterTabs({ assignedOrders, deliveredOrders, canceledOrders, driverId }: FooterTabsProps) {
    const [activeStatus, setActiveStatus] = useState<string>('ASSIGNED');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const status = params.get('status');
            if (status && ['ASSIGNED', 'DELIVERED', 'CANCELED'].includes(status)) {
                setActiveStatus(status);
            } else {
                setActiveStatus('ASSIGNED');
            }
        }
    }, []);

    return (
        <nav className="fixed bottom-0 z-50 w-full bg-background/98 backdrop-blur-md border-t border-border h-14 flex items-center justify-center mb-1">
            <div className="flex w-full max-w-md h-full items-center justify-between">
                {/* Home button */}
                <button
                    className="flex flex-col items-center justify-center h-full min-w-[56px] px-1 relative group focus:outline-none"
                    aria-label="الرئيسية"
                    onClick={() => { window.location.href = `/driver?driverId=${driverId}`; }}
                >
                    <Icon name="Car" className="h-5 w-5 text-primary" />
                </button>
                <div className="h-8 w-px bg-border mx-1" />
                {/* ASSIGNED tab */}
                <button
                    className={`flex flex-1 flex-col items-center justify-center h-full min-w-[64px] px-1 relative group focus:outline-none`}
                    aria-current={activeStatus === 'ASSIGNED' ? 'page' : undefined}
                    style={{ touchAction: 'manipulation' }}
                    onClick={() => window.location.href = `/driver/showdata?status=ASSIGNED&driverId=${driverId}`}
                >
                    <div className="flex flex-row items-center gap-1">
                        <Icon name="UserCheck" className={`h-5 w-5 ${activeStatus === 'ASSIGNED' ? 'text-info' : 'text-muted-foreground'}`} />
                        <span className={`text-xs font-medium ${activeStatus === 'ASSIGNED' ? 'text-info' : 'text-muted-foreground'}`}>مُخصص</span>
                        <span className={`ml-1 text-xs ${activeStatus === 'ASSIGNED' ? 'text-info' : 'text-muted-foreground'}`}>{assignedOrders}</span>
                    </div>
                    {activeStatus === 'ASSIGNED' && <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-8 h-0.5 rounded bg-primary" />}
                </button>
                <div className="h-8 w-px bg-border mx-1" />
                {/* DELIVERED tab */}
                <button
                    className={`flex flex-1 flex-col items-center justify-center h-full min-w-[64px] px-1 relative group focus:outline-none`}
                    aria-current={activeStatus === 'DELIVERED' ? 'page' : undefined}
                    style={{ touchAction: 'manipulation' }}
                    onClick={() => window.location.href = `/driver/showdata?status=DELIVERED&driverId=${driverId}`}
                >
                    <div className="flex flex-row items-center gap-1">
                        <Icon name="CheckCircle" className={`h-5 w-5 ${activeStatus === 'DELIVERED' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`text-xs font-medium ${activeStatus === 'DELIVERED' ? 'text-primary' : 'text-muted-foreground'}`}>سلمت</span>
                        <span className={`ml-1 text-xs ${activeStatus === 'DELIVERED' ? 'text-primary' : 'text-muted-foreground'}`}>{deliveredOrders}</span>
                    </div>
                    {activeStatus === 'DELIVERED' && <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-8 h-0.5 rounded bg-primary" />}
                </button>
                <div className="h-8 w-px bg-border mx-1" />
                {/* CANCELED tab */}
                <button
                    className={`flex flex-1 flex-col items-center justify-center h-full min-w-[64px] px-1 relative group focus:outline-none`}
                    aria-current={activeStatus === 'CANCELED' ? 'page' : undefined}
                    style={{ touchAction: 'manipulation' }}
                    onClick={() => window.location.href = `/driver/showdata?status=CANCELED&driverId=${driverId}`}
                >
                    <div className="flex flex-row items-center gap-1">
                        <Icon name="X" className={`h-5 w-5 ${activeStatus === 'CANCELED' ? 'text-destructive' : 'text-muted-foreground'}`} />
                        <span className={`text-xs font-medium ${activeStatus === 'CANCELED' ? 'text-destructive' : 'text-muted-foreground'}`}>الغيت</span>
                        <span className={`ml-1 text-xs ${activeStatus === 'CANCELED' ? 'text-destructive' : 'text-muted-foreground'}`}>{canceledOrders}</span>
                    </div>
                    {activeStatus === 'CANCELED' && <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-8 h-0.5 rounded bg-primary" />}
                </button>
                <div className="h-8 w-px bg-border mx-1" />
                {/* Analytics button (right) */}
                <button
                    className="flex flex-col items-center justify-center h-full min-w-[56px] px-1 relative group focus:outline-none"
                    aria-label="إحصائيات"
                    onClick={() => { }}
                >
                    <Icon name="BarChart3" className="h-5 w-5 text-info" />
                </button>
            </div>
        </nav>
    );
} 