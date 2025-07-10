import Image from 'next/image';
import Link from 'next/link';
import { getPromotions } from '../../actions/getPromotions';

// Add Promotion type
interface Promotion {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    imageUrl?: string;
    discountPercentage?: number;
    productAssignments?: { product: any }[];
    description?: string;
}

export default async function FeaturedPromotions() {
    const promotions = await getPromotions() as Promotion[];
    const activePromotions = promotions.filter((offer: Promotion) => offer.isActive);

    if (activePromotions.length === 0) return null;

    return (
        <section className="my-8">
            <h2 className="mb-4 text-2xl font-bold">العروض المميزة</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activePromotions.map((offer: Promotion) => (
                    <Link
                        key={offer.id}
                        href={`/offers/${offer.slug}`}
                        className="group block overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {/* Offer Image */}
                        <div className="relative aspect-video overflow-hidden">
                            {offer.imageUrl ? (
                                <Image
                                    src={offer.imageUrl}
                                    alt={offer.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            ) : (
                                <div className="h-full w-full bg-gradient-to-r from-primary/30 to-primary/10" />
                            )}

                            {/* Discount Badge */}
                            {offer.discountPercentage && (
                                <div className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                                    {offer.discountPercentage}% خصم
                                </div>
                            )}
                        </div>

                        {/* Offer Details */}
                        <div className="p-4">
                            <h3 className="mb-2 text-lg font-semibold flex items-center gap-2">
                                {offer.name}
                                {Array.isArray(offer.productAssignments) && (
                                    offer.productAssignments.length > 0 ? (
                                        <span
                                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-feature-products-soft text-feature-products border border-feature-products animate-fade-in"
                                            title="عدد المنتجات المرتبطة بهذا العرض"
                                        >
                                            {offer.productAssignments.length} منتج
                                        </span>
                                    ) : (
                                        <span
                                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-muted animate-fade-in"
                                            title="لا توجد منتجات مرتبطة بهذا العرض بعد"
                                        >
                                            لا توجد منتجات بعد
                                        </span>
                                    )
                                )}
                            </h3>
                            {offer.description && (
                                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                                    {offer.description}
                                </p>
                            )}

                            {/* View Products Button */}
                            <span className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground group-hover:bg-primary/90 transition-colors">
                                تصفح المنتجات
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}