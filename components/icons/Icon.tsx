import * as LucideIcons from 'lucide-react';
import * as FaIcons from 'react-icons/fa';
import * as Fa6Icons from 'react-icons/fa6';
import React from 'react';
import { cva } from 'class-variance-authority';

// Local iconVariants definition (copied from lib/utils)
const iconVariants = cva('inline-block shrink-0', {
    variants: {
        variant: {
            default: 'text-foreground',
            primary: 'text-primary',
            secondary: 'text-secondary',
            destructive: 'text-destructive',
            muted: 'text-muted-foreground',
            accent: 'text-accent-foreground',
            success: 'text-success',
            warning: 'text-warning',
            info: 'text-info',
        },
        size: {
            xs: 'h-4 w-4',
            sm: 'h-5 w-5',
            md: 'h-6 w-6',
            lg: 'h-8 w-8',
            xl: 'h-10 w-10',
        },
        animation: {
            none: '',
            spin: 'animate-spin',
            pulse: 'animate-pulse',
            bounce: 'animate-bounce',
            ping: 'animate-ping',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
        animation: 'none',
    },
});

const iconMap = {
    ...LucideIcons,
    ...FaIcons,
    ...Fa6Icons,
};

// Types for size and variant based on iconVariants
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconVariant =
    | 'default'
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'muted'
    | 'accent'
    | 'success'
    | 'warning'
    | 'info';

interface IconProps {
    name: string;
    size?: IconSize;
    variant?: IconVariant;
    animation?: 'none' | 'spin' | 'pulse' | 'bounce' | 'ping';
    [key: string]: any;
}

export function Icon({ name, size = 'md', variant = 'default', animation = 'none', ...props }: IconProps) {
    const IconComponent = iconMap[name as keyof typeof iconMap] as React.ComponentType<any> | undefined;
    if (!IconComponent) return null;
    return <IconComponent className={iconVariants({ size, variant, animation })} {...props} />;
} 