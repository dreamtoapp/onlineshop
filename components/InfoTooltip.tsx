'use client';

import React, { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Icon } from '@/components/icons/Icon';

export interface InfoTooltipProps {
  content: React.ReactNode;
  title?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  className?: string;
  iconSize?: number;
  iconClassName?: string;
  delayDuration?: number;
  sideOffset?: number;
  ariaLabel?: string;
  disabled?: boolean;
  // Custom trigger support (preserves backward compatibility)
  children?: React.ReactNode;
  asChild?: boolean;
  classNameTrigger?: string;
  tone?: 'info' | 'warning' | 'critical';
}

// Map number size to IconSize string (memoized per size)
const mapIconSize = (size: number): 'xs' | 'sm' | 'md' | 'lg' | 'xl' => {
  if (size <= 16) return 'xs';
  if (size <= 20) return 'sm';
  if (size <= 24) return 'md';
  if (size <= 32) return 'lg';
  return 'xl';
};

function InfoTooltipComponent({
  content,
  title,
  side = 'top',
  align = 'center',
  className,
  iconSize = 14,
  iconClassName = 'text-muted-foreground',
  delayDuration = 300,
  sideOffset = 6,
  ariaLabel = 'معلومات إضافية',
  disabled = false,
  children,
  asChild = true,
  classNameTrigger,
  tone = 'info',
}: InfoTooltipProps) {
  const iconSz = useMemo(() => mapIconSize(iconSize), [iconSize]);
  const toneClass = tone === 'critical' ? 'text-red-600' : tone === 'warning' ? 'text-amber-600' : iconClassName;
  const iconName = tone === 'critical' ? 'AlertTriangle' : tone === 'warning' ? 'AlertCircle' : 'Info';
  const hoverClass = tone === 'critical'
    ? 'hover:text-red-700 hover:bg-red-50'
    : tone === 'warning'
      ? 'hover:text-amber-700 hover:bg-amber-50'
      : 'hover:text-foreground hover:bg-accent/30';

  if (disabled) return null;

  const trigger = children ? (
    children
  ) : (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={`h-5 w-5 p-0 rounded transition-colors duration-150 ${hoverClass} ${classNameTrigger || ''}`}
      aria-label={ariaLabel}
    >
      <Icon name={iconName} size={iconSz} className={toneClass} />
      <span className="sr-only">{ariaLabel}</span>
    </Button>
  );

  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild={asChild}>{trigger}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={`max-w-xs text-sm p-3 bg-popover text-popover-foreground shadow-md rounded-md ${className || ''}`}
      >
        {title && <p className="mb-1 font-semibold">{title}</p>}
        {typeof content === 'string' ? <p>{content}</p> : content}
      </TooltipContent>
    </Tooltip>
  );
}

const InfoTooltip = memo(InfoTooltipComponent);
export default InfoTooltip;
