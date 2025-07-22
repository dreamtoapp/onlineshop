"use client";
import { Card, CardHeader, CardFooter } from '../../../components/ui/card';
import { Icon } from '@/components/icons/Icon';
import StartTrip from '../components/StartTrip';
import CancelOrder from '../components/CancelOrder';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../components/ui/collapsible';
import GoogleMapsLink from '@/components/GoogleMapsLink';
import WhatsappIcon from '@/app/(e-comm)/homepage/component/Fotter/WhatsappIcon';
import { Button } from '@/components/ui/button';

export default function AssignedOrderCard({ order, driverId, activeTrip }: { order: any; driverId: string; activeTrip: any }) {
    return (
        <Card className='rounded-lg border border-border bg-background shadow-md mb-4'>
            <CardHeader className='flex items-center flex-row p-2 justify-between rounded-t-lg bg-muted w-full'>
                <div className='flex items-center gap-2'>
                    <Icon name="FileText" size="sm" className="text-info" />
                    <span className='text-sm font-medium text-primary-foreground'> {order.orderNumber}</span>
                </div>
                <div>
                    {!activeTrip && (
                        <StartTrip
                            orderId={order.id}
                            driverId={driverId}
                            latitude={order.address?.latitude ?? ''}
                            longitude={order.address?.longitude ?? ''}
                            driverName={order.customerName ?? ''}
                        />
                    )}
                </div>
            </CardHeader>
            <div className='p-4 flex flex-col gap-2'>
                <Collapsible>
                    <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between w-full cursor-pointer bg-muted/60 rounded px-3 py-2">
                            <span className="font-bold text-base">إجمالي الطلب: {order.amount ?? 'غير متوفر'}</span>
                            <Icon name="ChevronDown" size="sm" className="text-muted-foreground" />
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className='mt-3 p-2 rounded bg-background border border-border text-xs text-muted-foreground'>
                            {Array.isArray(order.items) && order.items.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-xs text-right border border-border rounded">
                                        <thead>
                                            <tr className="bg-muted/40">
                                                <th className="px-2 py-1">المنتج</th>
                                                <th className="px-2 py-1">الكمية</th>
                                                <th className="px-2 py-1">السعر للوحدة</th>
                                                <th className="px-2 py-1">الإجمالي</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((item: any, idx: number) => (
                                                <tr key={item.productId || idx} className="border-t border-border">
                                                    <td className="px-2 py-1">{item.product?.name || 'غير محدد'}</td>
                                                    <td className="px-2 py-1">{item.quantity}</td>
                                                    <td className="px-2 py-1">{item.price}</td>
                                                    <td className="px-2 py-1">{(item.price * item.quantity).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div>لا توجد منتجات في هذا الطلب.</div>
                            )}
                            {order.createdAt && (
                                <div className='mt-1'>تاريخ الإنشاء: {new Date(order.createdAt).toLocaleString('ar-EG')}</div>
                            )}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                <div className='flex flex-col sm:flex-row gap-2 justify-between'>
                    <div className='flex items-center gap-2 mt-2'>
                        <Icon name="User" size="sm" className='text-muted-foreground' />
                        <span className='text-sm'>{order.customer?.name || ''}</span>
                    </div>
                    {order.address?.latitude && order.address?.longitude && (
                        <div className='flex flex-col sm:flex-row gap-2 mt-2'>
                            <GoogleMapsLink
                                latitude={order.address.latitude}
                                longitude={order.address.longitude}
                                label='الخريطة'
                                showIcon={true}
                                // showExternalIcon={true}
                                variant='default'
                                size='default'
                            />
                        </div>
                    )}
                </div>
                <div className='flex flex-col gap-1 bg-muted/40 rounded p-2 mt-1 text-sm font-normal'>
                    <div className='flex items-center gap-2'>
                        <Icon name="MapPin" size="sm" className='text-info h-4 w-4' />
                        <span className='font-bold'>العنوان:</span>
                        <span className='text-sm'>{order.address?.label || ''}</span>
                    </div>
                    {order.address?.district && (
                        <div className='flex items-center gap-2'><Icon name="Home" size="xs" className='text-muted-foreground h-4 w-4 ' /><span>الحي:</span><span>{order.address.district}</span></div>
                    )}
                    {order.address?.street && (
                        <div className='flex items-center gap-2'><Icon name="Road" size="xs" className='text-muted-foreground h-4 w-4' /><span>الشارع:</span><span>{order.address.street}</span></div>
                    )}
                    {order.address?.buildingNumber && (
                        <div className='flex items-center gap-2'><Icon name="Building" size="xs" className='text-muted-foreground h-4 w-4' /><span>رقم المبنى:</span><span>{order.address.buildingNumber}</span></div>
                    )}
                    {order.address?.floor && (
                        <div className='flex items-center gap-2'><Icon name="Layers" size="xs" className='text-muted-foreground' /><span>الدور:</span><span>{order.address.floor}</span></div>
                    )}
                    {order.address?.apartmentNumber && (
                        <div className='flex items-center gap-2'><Icon name="DoorOpen" size="xs" className='text-muted-foreground' /><span>الشقة:</span><span>{order.address.apartmentNumber}</span></div>
                    )}
                    {order.address?.landmark && (
                        <div className='flex items-center gap-2'><Icon name="Star" size="xs" className='text-muted-foreground' /><span>علامة مميزة:</span><span>{order.address.landmark}</span></div>
                    )}

                </div>
                {order.notes && (
                    <div className='flex items-center gap-2 mt-2 bg-yellow-50 rounded p-2'>
                        <Icon name="Info" size="sm" className='text-yellow-600' />
                        <span className='text-sm'>{order.notes}</span>
                    </div>
                )}
            </div>
            <div className='w-full h-px bg-border my-2' />
            <CardFooter className='w-full flex justify-between items-center gap-4'>
                <CancelOrder
                    orderId={order.id}
                    orderNumber={order.orderNumber ?? ''}
                    driverId={driverId}
                    driverName={order.customerName ?? ''}
                />
                <div className='flex gap-2 items-center'>
                    {order.customer?.phone && (
                        <a href={`tel:${order.customer.phone}`} className='flex items-center justify-center rounded-lg bg-muted/80 text-primary h-9 w-9  '>
                            <Icon name="Phone" size="sm" />
                        </a>
                    )}

                    {order.address?.latitude && order.address?.longitude && (
                        <Button
                            type='button'
                            variant='secondary'
                            size='icon'
                            className='flex items-center justify-center'
                            onClick={() => {
                                const lat = order.address.latitude;
                                const lng = order.address.longitude;
                                const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                                const message = encodeURIComponent(`موقع التوصيل على الخريطة: ${mapsUrl}`);
                                window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener,noreferrer');
                            }}
                        >
                            <WhatsappIcon width={20} height={20} />
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
} 