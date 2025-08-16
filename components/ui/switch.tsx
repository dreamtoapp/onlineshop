'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // Base styles with improved sizing and modern design
      'peer group relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-md transition-all duration-300 ease-out',
      // Focus states with enhanced ring
      'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      // Disabled state
      'disabled:cursor-not-allowed disabled:opacity-50',
      // Checked state - modern gradient background
      'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-primary/90 data-[state=checked]:shadow-lg data-[state=checked]:shadow-primary/25',
      // Unchecked state - subtle background with better contrast
      'data-[state=unchecked]:bg-muted/80 data-[state=unchecked]:hover:bg-muted',
      // Hover effects
      'hover:shadow-lg transition-shadow',
      // Active state
      'active:scale-95',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        // Enhanced thumb with better shadows and animations
        'pointer-events-none block h-5 w-5 rounded-full bg-secondary shadow-xl ring-0 transition-all duration-300 ease-out',
        // Transform animations with spring-like easing
        'data-[state=checked]:-translate-x-5 data-[state=unchecked]:translate-x-1',
        // Subtle scale effect on state change
        'data-[state=checked]:scale-100 data-[state=unchecked]:scale-95',
        // Enhanced shadow for depth
        'shadow-black/20 data-[state=checked]:shadow-black/30',
        // Border for better definition
        'border border-border/20',
        // Subtle glow effect when checked
        'data-[state=checked]:shadow-primary/20',
      )}
    />

    {/* Optional: Add subtle inner glow effect */}
    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };