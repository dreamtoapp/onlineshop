'use client';

import Link from '@/components/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, Edit3, BarChart2, Package, DollarSign, Info, CheckCircle, XCircle, Images } from 'lucide-react';
import { toast } from 'sonner';

import AddImage from '@/components/AddImage';
import ProductDeleteButton from './ProductDeleteButton';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    size?: string | null;
    details?: string | null;
    imageUrl?: string | null;
    images?: string[];
    published: boolean;
    outOfStock?: boolean;
  };
}

// Enhanced ProductCard with AddImage integration
export default function ProductCard({ product }: ProductCardProps) {
  const currentImageUrl = product.imageUrl;
  const hasGallery = product.images && product.images.length > 0;

  return (
    <Card className="flex flex-col h-full min-h-[380px] w-full rounded-xl border shadow-lg transition-all duration-300 card-hover-effect card-border-glow bg-gradient-to-b from-card to-card/80">
      {/* Product Image Section with Upload */}
      <CardContent className="p-0">
        <div className="relative w-full aspect-square overflow-hidden rounded-t-xl bg-gradient-to-br from-muted/50 to-muted">
          <AddImage
            url={currentImageUrl || undefined}
            alt={`صورة ${product.name}`}
            className="object-cover"
            recordId={product.id}
            table="product"
            tableField="imageUrl"
            onUploadComplete={() => {
              toast.success('تم تحديث صورة المنتج بنجاح');
              // Refresh the page to show the new image
              setTimeout(() => window.location.reload(), 1000);
            }}
            autoUpload={true}
          />

        </div>

        {/* Product Information Section */}
        <div className="p-4 space-y-3 flex-1 min-h-[160px]">
          {/* Status Badges Row (moved out of image overlay) */}
          <div className="flex items-center gap-2">
            <Badge
              variant={product.published ? 'default' : 'secondary'}
              className={`${product.published
                ? 'bg-feature-analytics text-primary-foreground border-feature-analytics'
                : 'bg-feature-settings-soft text-feature-settings border-feature-settings/30'
                } text-xs px-2 py-1`}
            >
              {product.published ? (
                <>
                  <CheckCircle className="h-3 w-3 ml-1" />
                  منشور
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 ml-1" />
                  مسودة
                </>
              )}
            </Badge>

            {typeof product.outOfStock !== 'undefined' && (
              <Badge
                className={`${product.outOfStock
                  ? 'bg-destructive text-destructive-foreground border-destructive'
                  : 'bg-feature-products text-primary-foreground border-feature-products'
                  } text-xs px-2 py-1`}
              >
                {product.outOfStock ? (
                  <>
                    <XCircle className="h-3 w-3 ml-1" />
                    نفد
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 ml-1" />
                    متوفر
                  </>
                )}
              </Badge>
            )}
          </div>
          {/* Product Name */}
          <div className="flex items-start gap-2">
            <Package className="h-4 w-4 text-feature-products mt-1 flex-shrink-0 icon-enhanced" />
            <h3 className="font-semibold text-sm leading-tight text-foreground transition-colors duration-200 line-clamp-2" title={product.name}>
              {product.name}
            </h3>
          </div>

          {/* Price Section */}
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-feature-commerce icon-enhanced" />
            <span className="text-lg font-bold text-feature-commerce">
              {product.price.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}
            </span>
          </div>

          {/* Product Details */}
          <div className="space-y-2 text-xs">
            {product.size && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Info className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">المقاس: {product.size}</span>
              </div>
            )}

            {product.details && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {product.details}
              </p>
            )}
          </div>
        </div>
      </CardContent>

      {/* Action Buttons Footer */}
      <CardFooter className="mt-auto p-3 border-t border-border/30 bg-gradient-to-r from-card/80 to-card/60 rounded-b-xl">
        <div className="flex items-center justify-between w-full gap-2">
          {/* View Actions */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/dashboard/management-products/gallery/${product.id}`}
                  className="p-2 h-8 rounded-md border border-feature-products/20 text-feature-products transition-all duration-200"
                >
                  <Images className="h-4 w-4 icon-enhanced" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                {hasGallery
                  ? `إدارة المعرض (${product.images?.length} صور)`
                  : 'إنشاء معرض صور للمنتج'
                }
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/dashboard/management-products/view/${product.id}`}
                  className="btn-view-outline p-2 h-8 rounded-md border border-feature-analytics/20 text-feature-analytics transition-all duration-200"
                >
                  <Eye className="h-4 w-4 icon-enhanced" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>عرض التفاصيل</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/dashboard/management-products/analytics/${product.id}`}
                  className="p-2 h-8 rounded-md border border-feature-analytics/20 text-feature-analytics transition-all duration-200"
                >
                  <BarChart2 className="h-4 w-4 icon-enhanced" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>تحليلات المنتج</TooltipContent>
            </Tooltip>
          </div>

          {/* Edit Actions */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/dashboard/management-products/edit/${product.id}`}
                  className="btn-edit p-2 h-8 rounded-md border border-feature-settings/20 text-feature-settings transition-all duration-200"
                >
                  <Edit3 className="h-4 w-4 icon-enhanced" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>تعديل المنتج</TooltipContent>
            </Tooltip>

            <ProductDeleteButton productId={product.id} />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
