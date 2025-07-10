"use client";
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React from 'react';

interface InfoTooltipProps {
    message: React.ReactNode;
    side?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'center' | 'start' | 'end';
    iconClassName?: string;
    buttonClassName?: string;
}

export default function InfoTooltip({
    message,
    side = 'top',
    align = 'center',
    iconClassName = 'h-5 w-5 text-muted-foreground',
    buttonClassName = 'p-2 rounded-full bg-muted hover:bg-muted/70 focus:outline-none'
}: InfoTooltipProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button type="button" tabIndex={0} className={buttonClassName}>
                        <Info className={iconClassName} />
                    </button>
                </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <span>{message}</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
} 