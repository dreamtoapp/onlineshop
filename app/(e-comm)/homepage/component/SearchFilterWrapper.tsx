'use client';
import ProductInfiniteGrid from '../component/ProductInfiniteGrid';

export default function SearchFilterWrapper({ initialProducts }: { initialProducts: any[] }) {
    // Optionally, keep filter state if ProductInfiniteGrid needs it
    // For now, just render the grid with initial products
    return <ProductInfiniteGrid initialProducts={initialProducts} filters={{}} />;
} 