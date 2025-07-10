"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  variant?: 'default' | 'minimal' | 'floating' | 'gradient';
  icon?: 'chevron' | 'arrow';
  showLabel?: boolean;
  customText?: string;
  customHref?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export default function BackButton({
  variant = 'default',
  icon = 'chevron',
  showLabel = true,
  customText,
  customHref,
  className,
  size = 'default'
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (customHref) {
      router.push(customHref);
    } else {
      router.back();
    }
  };

  // Icon selection based on RTL/LTR support
  const iconName = icon === 'chevron' ? 'ChevronRight' : 'ArrowRight';

  // Mobile-First Variant styles with proper touch targets
  const variantStyles = {
    default: 'bg-background hover:bg-muted border border-border shadow-sm hover:shadow-md transition-all duration-300 active:scale-95',
    minimal: 'bg-transparent hover:bg-muted/50 border-0 shadow-none hover:shadow-sm transition-all duration-300 active:scale-95',
    floating: 'bg-background/90 backdrop-blur-sm hover:bg-background/95 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full active:scale-95',
    gradient: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95'
  };

  // Mobile-First Size styles with proper touch targets (minimum 44px)
  const sizeStyles = {
    sm: 'min-h-[44px] h-10 px-3 text-sm sm:h-8 sm:min-h-[32px]', // Mobile: 44px, Desktop: 32px
    default: 'min-h-[48px] h-12 px-4 text-base sm:h-10 sm:min-h-[40px]', // Mobile: 48px, Desktop: 40px
    lg: 'min-h-[52px] h-14 px-6 text-lg sm:h-12 sm:min-h-[48px]' // Mobile: 52px, Desktop: 48px
  };

  const buttonText = customText || 'رجوع';

  return (
    <Button
      onClick={handleBack}
      variant="outline"
      className={cn(
        // Base mobile-first styles
        'flex items-center justify-center gap-2 font-medium will-change-transform',
        // Touch-friendly minimum width
        'min-w-[44px]',
        // RTL support
        'flex-row-reverse',
        // Variant and size styles
        variantStyles[variant],
        sizeStyles[size],
        // Enhanced mobile interactions
        'touch-manipulation select-none',
        // Focus states for accessibility
        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        className
      )}
    >
      <Icon
        name={iconName}
        className={cn(
          'transition-transform duration-300 flex-shrink-0',
          // Mobile-first icon sizes
          size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5',
          // Hover animation
          'group-hover:-translate-x-1'
        )}
      />
      {showLabel && (
        <span className={cn(
          'transition-all duration-300 whitespace-nowrap',
          // Hide text on very small screens if needed
          size === 'sm' && 'hidden xs:inline'
        )}>
          {buttonText}
        </span>
      )}
    </Button>
  );
}
