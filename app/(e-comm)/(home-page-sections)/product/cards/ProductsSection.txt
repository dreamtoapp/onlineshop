import ProductListWithScroll from './ProductListWithScroll';
import { fetchProductsPage } from '@/app/(e-comm)/homepage/actions/fetchProductsPage';

interface ProductsSectionProps {
    slug: string;
}

export default async function ProductsSection({ slug }: ProductsSectionProps) {
    // Fetch the first page of products for the given category slug
    const { products } = await fetchProductsPage(slug, 1);
    return <ProductListWithScroll firstPageProducts={products} categorySlug={slug} totalProducts={products.length} />;
} 