import { useState } from 'react';
import { Icon } from '@/components/icons/Icon';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import LoginPromptModal from './LoginPromptModal';

interface NotificationBellProps {
    count?: number;
    showNumber?: boolean;
    label?: string;
    className?: string;
    isLoggedIn?: boolean;
}

export default function NotificationBell({ count = 0, showNumber = false, label, className, isLoggedIn = false }: NotificationBellProps) {
    const [showPrompt, setShowPrompt] = useState(false);
    const hasAlert = count > 0;

    if (!isLoggedIn) {
        return (
            <>
                <div className="w-12 h-12 flex items-center justify-center p-2 relative">
                    <Button
                        variant="ghost"
                        className="relative flex items-center gap-2 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-feature-analytics/20"
                        onClick={() => setShowPrompt(true)}
                    >
                        <Icon name="Bell" size="md" className={clsx("h-7 w-7 text-foreground", className)} />
                    </Button>
                </div>
                <LoginPromptModal open={showPrompt} onOpenChange={setShowPrompt} message="يجب تسجيل الدخول أو إنشاء حساب للاطلاع على الإشعارات." />
            </>
        );
    }

    return (
        <div className="w-12 h-12 flex items-center justify-center p-2 relative">
            <Button
                variant="ghost"
                className="relative flex items-center gap-2 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-feature-analytics/20"
            >
                <Icon name="Bell" size="md" className={clsx("h-7 w-7 text-foreground", className)} />
                {label && <span className="ml-1 text-[10px] text-pink-400">{label}</span>}
                {hasAlert && showNumber && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold shadow ring-1 ring-white dark:ring-gray-900 border border-primary animate-in fade-in zoom-in">
                        {count}
                    </span>
                )}
            </Button>
        </div>
    );
} 