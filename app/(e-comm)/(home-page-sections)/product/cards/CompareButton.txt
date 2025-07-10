'use client';
import { useState } from 'react';
import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';

interface CompareButtonProps {
    /**
     * Unique identifier of the product. Currently not used but kept for future analytics implementation
     * and to satisfy component contract with parent components.
     */
    productId: string;
}

export default function CompareButton({ productId }: CompareButtonProps) {
    // NOTE: productId is currently unused but kept for future analytics/events integration.
    void productId;

    const [selected, setSelected] = useState(false);

    const toggleCompare = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelected((prev) => !prev);
        // TODO: emit compare event or update compare store using productId
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${selected ? 'bg-feature-products-soft text-feature-products' : 'bg-white/90 text-muted-foreground'} shadow-md transition-all duration-200 hover:scale-105 min-w-[36px] min-h-[36px] md:min-w-[44px] md:min-h-[44px]`}
            aria-label={selected ? 'إلغاء المقارنة' : 'إضافة إلى مقارنة المنتجات'}
            onClick={toggleCompare}
            data-analytics="compare-toggle"
        >
            <Icon name="ArrowLeftRight" size="sm" />
        </Button>
    );
} 