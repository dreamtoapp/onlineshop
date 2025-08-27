'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PLACEHOLDER_TEXTS } from '../helpers';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { AddressInput } from '../helpers';

interface AddressFormFieldsProps {
  register: UseFormRegister<AddressInput>;
  errors: FieldErrors<AddressInput>;
  isOptionalOpen: boolean;
  onOptionalOpenChange: (open: boolean) => void;
}

export function AddressFormFields({
  register,
  errors,
  isOptionalOpen,
  onOptionalOpenChange
}: AddressFormFieldsProps) {
  return (
    <div className="space-y-4 py-4">
      {/* Required Fields */}
      <div className="space-y-4">
        {/* District */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <span className="text-sm font-medium">الحي</span>
            <span className="text-destructive text-xs">*</span>
          </Label>
          <Input
            {...register('district')}
            placeholder={PLACEHOLDER_TEXTS.DISTRICT}
            className="h-10 focus:border-feature-suppliers"
          />
          {errors.district && <p className="text-sm text-red-500">{errors.district.message}</p>}
        </div>

        {/* Street */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <span className="text-sm font-medium">الشارع</span>
            <span className="text-destructive text-xs">*</span>
          </Label>
          <Input
            {...register('street')}
            placeholder={PLACEHOLDER_TEXTS.STREET}
            className="h-10 focus:border-feature-suppliers"
          />
          {errors.street && <p className="text-sm text-red-500">{errors.street.message}</p>}
        </div>

        {/* Building Number */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <span className="text-sm font-medium">رقم المبنى</span>
            <span className="text-destructive text-xs">*</span>
          </Label>
          <Input
            {...register('buildingNumber')}
            placeholder={PLACEHOLDER_TEXTS.BUILDING_NUMBER}
            className="h-10 focus:border-feature-suppliers"
          />
          {errors.buildingNumber && <p className="text-sm text-red-500">{errors.buildingNumber.message}</p>}
        </div>
      </div>

      {/* Optional Fields Collapsible */}
      <Collapsible open={isOptionalOpen} onOpenChange={onOptionalOpenChange} className="space-y-3">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between h-10 px-4 text-left">
            <span className="font-medium text-sm">الحقول الاختيارية</span>
            {isOptionalOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-3">
          {/* Floor & Apartment - Side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <span className="text-sm font-medium">الطابق</span>
                <span className="text-muted-foreground text-xs">(اختياري)</span>
              </Label>
              <Input
                {...register('floor')}
                placeholder={PLACEHOLDER_TEXTS.FLOOR}
                className="h-10 focus:border-feature-suppliers"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <span className="text-sm font-medium">رقم الشقة</span>
                <span className="text-muted-foreground text-xs">(اختياري)</span>
              </Label>
              <Input
                {...register('apartmentNumber')}
                placeholder={PLACEHOLDER_TEXTS.APARTMENT_NUMBER}
                className="h-10 focus:border-feature-suppliers"
              />
            </div>
          </div>

          {/* Landmark */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <span className="text-sm font-medium">معلم قريب</span>
              <span className="text-muted-foreground text-xs">(اختياري)</span>
            </Label>
            <Input
              {...register('landmark')}
              placeholder={PLACEHOLDER_TEXTS.LANDMARK}
              className="h-10 focus:border-feature-suppliers"
            />
            <p className="text-xs text-muted-foreground">معلم معروف قريب من العنوان للمساعدة في الوصول</p>
          </div>

          {/* Delivery Instructions */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <span className="text-sm font-medium">تعليمات التوصيل</span>
              <span className="text-muted-foreground text-xs">(اختياري)</span>
            </Label>
            <Textarea
              {...register('deliveryInstructions')}
              placeholder={PLACEHOLDER_TEXTS.DELIVERY_INSTRUCTIONS}
              className="focus:border-feature-suppliers min-h-[60px]"
              rows={2}
            />
            <p className="text-xs text-muted-foreground">تعليمات خاصة للموصل لضمان وصول الطلب بشكل صحيح</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}














