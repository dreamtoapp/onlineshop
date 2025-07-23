'use client';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icon } from '@/components/icons/Icon';
import { Order } from '@/types/databaseTypes';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { revertOrderToAssigned } from '../actions/revertOrderToAssigned';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import WhatsappShareButton from '@/components/WhatsappShareButton';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import GoogleMapsLink from '@/components/GoogleMapsLink';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
// Small components for clarity
function OrderSummary({ order }: { order: Order }) {
  return (
    <Card className='w-full rounded-lg bg-card p-4 shadow-sm'>
      <div className='mb-3 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-lg font-semibold text-primary'>طلب #{order.orderNumber}</span>
        </div>
        <span className='text-sm text-muted-foreground'>
          {formatDistanceToNow(new Date(order.createdAt), {
            addSuffix: true,
            locale: ar,
          })}
        </span>
      </div>
      <div className='space-y-2 text-foreground'>
        <div className='flex items-center gap-2'>
          <Icon name="User" className='h-5 w-5 text-muted-foreground' />
          <span>{order.customer.name || 'عميل غير معروف'}</span>
        </div>
      </div>
    </Card>
  );
}

function AddressSection({ order }: { order: Order }) {
  const address = order.address;
  const [open, setOpen] = useState(false);
  if (!address) return null;
  const whatsappMessage = address.latitude && address.longitude
    ? `موقع التوصيل على الخريطة: https://www.google.com/maps?q=${address.latitude},${address.longitude}`
    : 'موقع التوصيل';
  return (
    <Card className='w-full rounded-lg bg-card p-4 shadow-sm'>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <div className='mb-3 flex items-center gap-2 cursor-pointer select-none flex-row-reverse justify-between'>
            <Icon name="ChevronDown" className="text-muted-foreground" />
            <div className='flex items-center gap-2'>
              <Icon name="MapPin" className='h-5 w-5 text-muted-foreground' />
              <span className='text-lg font-semibold text-primary'>العنوان</span>
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className='space-y-2 pr-2 text-foreground'>
            {address.label && (
              <div className='flex items-center gap-2'><Icon name="Home" className='h-5 w-5 text-muted-foreground' /><span className='font-bold'>المنزل</span><span className='font-normal'>{address.label}</span></div>
            )}
            {address.district && (
              <div className='flex items-center gap-2'><Icon name="Home" className='h-5 w-5 text-muted-foreground' /><span className='font-bold'>الحي:</span><span className='font-normal'>{address.district}</span></div>
            )}
            {address.street && (
              <div className='flex items-center gap-2'><Icon name="Road" className='h-5 w-5 text-muted-foreground' /><span className='font-bold'>الشارع:</span><span className='font-normal'>{address.street}</span></div>
            )}
            {address.buildingNumber && (
              <div className='flex items-center gap-2'><Icon name="Building" className='h-5 w-5 text-muted-foreground' /><span className='font-bold'>رقم المبنى:</span><span className='font-normal'>{address.buildingNumber}</span></div>
            )}
            {address.floor && (
              <div className='flex items-center gap-2'><Icon name="Layers" className='h-5 w-5 text-muted-foreground' /><span className='font-bold'>الدور:</span><span className='font-normal'>{address.floor}</span></div>
            )}
            {address.apartmentNumber && (
              <div className='flex items-center gap-2'><Icon name="DoorOpen" className='h-5 w-5 text-muted-foreground' /><span className='font-bold'>الشقة:</span><span className='font-normal'>{address.apartmentNumber}</span></div>
            )}
            {address.landmark && (
              <div className='flex items-center gap-2'><Icon name="Star" className='h-5 w-5 text-muted-foreground' /><span className='font-bold'>علامة مميزة:</span><span className='font-normal'>{address.landmark}</span></div>
            )}
            <div className='flex justify-between gap-2 mt-2'>
              {address.latitude && address.longitude && (
                <div className='flex-1'>
                  <GoogleMapsLink
                    latitude={address.latitude}
                    longitude={address.longitude}
                    label=""
                    variant="outline"
                    size="default"
                    showIcon={true}
                    className="w-full h-12 flex items-center justify-center rounded-lg"
                  />
                </div>
              )}
              {order.customer?.phone && (
                <div className='flex-1'>
                  <a href={`tel:${order.customer.phone}`} className='w-full h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors'>
                    <Icon name="PhoneCall" className='h-5 w-5' />
                  </a>
                </div>
              )}
              <div className='flex-1'>
                <div className="w-full h-12 flex items-center justify-center rounded-lg bg-muted">
                  <WhatsappShareButton
                    message={whatsappMessage}
                    size="icon"
                  />
                </div>
              </div>
              <div className='flex-1'>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <button className="w-full h-12 flex items-center justify-center rounded-lg bg-muted hover:bg-muted/70 transition-colors" title="معلومات العنوان">
                      <Icon name="Info" className='h-5 w-5 text-primary' />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md w-full">
                    <DialogHeader>
                      <DialogTitle>معلومات العنوان الكاملة</DialogTitle>
                    </DialogHeader>
                    <DialogDescription asChild>
                      <div className="space-y-3 text-right">
                        <div><span className='font-bold'>المنزل: </span>{address.label || 'لا يوجد'}</div>
                        <div><span className='font-bold'>الحي: </span>{address.district || 'لا يوجد'}</div>
                        <div><span className='font-bold'>الشارع: </span>{address.street || 'لا يوجد'}</div>
                        <div><span className='font-bold'>رقم المبنى: </span>{address.buildingNumber || 'لا يوجد'}</div>
                        <div><span className='font-bold'>الدور: </span>{address.floor || 'لا يوجد'}</div>
                        <div><span className='font-bold'>الشقة: </span>{address.apartmentNumber || 'لا يوجد'}</div>
                        <div><span className='font-bold'>علامة مميزة: </span>{address.landmark || 'لا يوجد'}</div>
                        <div><span className='font-bold'>تعليمات التوصيل: </span>{address.deliveryInstructions || 'لا يوجد'}</div>
                        {address.isDefault && (
                          <div className='inline-block px-3 py-1 mt-2 rounded-full bg-primary/10 text-primary font-bold text-xs'><Icon name="Star" className="inline-block h-4 w-4 mr-1 text-primary" /> العنوان الافتراضي</div>
                        )}
                      </div>
                    </DialogDescription>
                    <DialogClose asChild>
                      <button className="mt-4 w-full rounded bg-primary text-white py-2 font-bold">إغلاق</button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

function ProductList({ order }: { order: Order }) {
  return (
    <Card className='w-full rounded-lg bg-card p-4 shadow-sm'>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <div className='mb-3 flex items-center gap-2 cursor-pointer select-none flex-row-reverse justify-between'>
            <Icon name="ChevronDown" className="text-muted-foreground" />
            <div className='flex items-center gap-2'>
              <Icon name="Package" className='h-5 w-5 text-muted-foreground' />
              <span className='text-lg font-semibold text-primary'>المنتجات</span>
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ScrollArea className='h-[30vh] w-full bg-muted'>
            <div className='space-y-2 pr-2 text-foreground'>
              {order.items.map((item, index) => (
                <div key={item.id + index.toString()} className='flex items-center justify-between'>
                  <span>{item.product?.name}</span>
                  <div className='flex gap-4'>
                    <span className='text-muted-foreground'>x{item.quantity}</span>
                    <span className='font-medium'>{item.price} ريال</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
      <div className='mt-4 flex items-center justify-between border-t border-border pt-2'>
        <span className='font-semibold text-muted-foreground'>الإجمالي</span>
        <span className='text-xl font-bold text-success'>{order.amount.toFixed(2)} ريال</span>
      </div>
    </Card>
  );
}

function RevertButton({ onRevert }: { onRevert: () => void }) {
  return (
    <Button variant='destructive' className='w-full mt-4' onClick={onRevert}>
      <Icon name="Undo" className="ml-2" /> إرجاع الطلب إلى قائمة التعيين
    </Button>
  );
}

function DisabledActions() {
  return (
    <div className='w-full flex flex-col gap-2 mt-4 opacity-50 pointer-events-none'>
      <Button variant='default' disabled>تسليم الطلب</Button>
      <Button variant='default' disabled>إلغاء الطلب</Button>
      <Button variant='default' disabled>بدء التتبع</Button>
    </div>
  );
}

function PreTripActions({ onStartTrip, onRevert }: {
  onStartTrip: () => void,
  onRevert: () => void,
}) {
  return (
    <div className='w-full flex flex-col gap-2 mt-4'>
      <Button variant='default' className='w-full h-16' onClick={onStartTrip}>ابدء رحلتك</Button>
      <div className='flex items-center justify-center gap-2'>
        <Button variant='destructive' className='w-full' onClick={onRevert}>
          <Icon name="Undo" className="ml-2" /> إرجاع الطلب
        </Button>
      </div>
    </div>
  );
}

function ActionButtons({ mode, onRevert, onStartTracking, onDeliver, onCancel, inActiveTrip }: {
  mode: 'multi' | 'single',
  onRevert?: () => void,
  onStartTracking?: () => void,
  onDeliver?: () => void,
  onCancel?: () => void,
  inActiveTrip?: boolean,
}) {
  if (mode === 'multi') {
    return <RevertButton onRevert={onRevert!} />;
  }
  if (!inActiveTrip) {
    return (
      <div className='w-full flex flex-col gap-2 mt-4'>
        <Button variant='default' className='w-full' onClick={onStartTracking}>بدء التتبع الفعلي</Button>
        <DisabledActions />
      </div>
    );
  }
  return (
    <div className='w-full flex flex-col gap-2 mt-4'>
      <Button variant='default' className='w-full' onClick={onDeliver}>تسليم الطلب</Button>
      <Button variant='destructive' className='w-full' onClick={onCancel}>إلغاء الطلب</Button>
    </div>
  );
}

export default function ActiveTrip({ order, disableAllActions = false }: { order: Order, disableAllActions?: boolean }) {
  const customerLocation = '24.7136,46.6753';
  const googleMapsLink = `https://www.google.com/maps?q=${customerLocation}`;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // TODO: Replace with real check for ActiveTrip existence
  const inActiveTrip = false; // Simulate: not in ActiveTrip
  const handleRevert = async () => {
    setLoading(true);
    const res = await revertOrderToAssigned(order.id);
    setLoading(false);
    if (res.success) {
      setError(null);
      router.refresh();
    } else {
      setError(res.error || 'فشل في إرجاع الطلب');
    }
  };
  const handleStartTrip = () => { /* TODO: implement start trip logic */ };
  const whatsappMessage = `طلبك قيد التوصيل! يمكنك تتبع السائق عبر هذا الرابط: https://yourapp.com/track/${order.id}`;
  return (
    <div className={`flex flex-col items-center justify-center gap-2 bg-background p-2 ${disableAllActions ? 'opacity-60' : ''}`}>
      {error && (
        <Alert variant='destructive' className='mb-2 w-full max-w-md'>
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <OrderSummary order={order} />
      <AddressSection order={order} />
      <ProductList order={order} />
      {disableAllActions ? (
        <RevertButton onRevert={handleRevert} />
      ) : !inActiveTrip ? (
        <PreTripActions
          onStartTrip={handleStartTrip}
          onRevert={handleRevert}
        />
      ) : null}
      {/* Sticky Status Bar */}
      <div className='fixed bottom-0 left-0 right-0 flex items-center justify-around border-t border-border bg-muted p-2 shadow-lg'>
        <a
          href={`tel:${order.customer.phone}`}
          className='flex items-center gap-2 text-primary transition-colors hover:text-primary/80'
        >
          <Icon name="PhoneCall" className='h-5 w-5' />
          <span className='font-semibold'>اتصل بالعميل</span>
        </a>
        <a
          href={googleMapsLink}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-2 text-success transition-colors hover:text-success/80'
        >
          <Icon name="MapPin" className='h-5 w-5' />
          <span className='font-semibold'>مشاركة الموقع</span>
        </a>
      </div>
    </div>
  );
}
