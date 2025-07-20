'use client';

import { toast } from 'sonner';

import AddImage from '@/components/AddImage';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import { UserRole } from '@prisma/client';
import GoogleMapsLink from '@/components/GoogleMapsLink';

import DeleteAdminAlert from './DeleteAdmin';
import AdminUpsert from './AdminUpsert';

type AdminCardProps = {
    admin: {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        role: UserRole;
        addresses?: Array<{
            id: string;
            label: string;
            district: string;
            street: string;
            buildingNumber: string;
            floor?: string | null;
            apartmentNumber?: string | null;
            landmark?: string | null;
            deliveryInstructions?: string | null;
            latitude?: string | null;
            longitude?: string | null;
            isDefault: boolean;
        }> | null;
        password?: string | null;
        sharedLocationLink?: string | null;
        image?: string | null;
        latitude?: string | null;
        longitude?: string | null;
        // Admin-specific fields
        adminLevel?: string | null;
        permissions?: string[] | null;
        isActive?: boolean | null;
    };
};

export default function AdminCard({ admin }: AdminCardProps) {
    const safeAdmin = {
        ...admin,
        name: admin.name || 'No Name',
        email: admin.email || '',
        password: undefined,
        imageUrl: admin.image || undefined,
    };

    const getAdminLevelBadge = (level: string | null | undefined) => {
        switch (level) {
            case 'SUPER_ADMIN':
                return <Badge variant="default" className="bg-red-600 hover:bg-red-700">مشرف رئيسي</Badge>;
            case 'MODERATOR':
                return <Badge variant="secondary" className="bg-orange-500 hover:bg-orange-600">مشرف فرعي</Badge>;
            default:
                return <Badge variant="default" className="bg-purple-600 hover:bg-purple-700">مشرف</Badge>;
        }
    };

    const getStatusBadge = (isActive: boolean | null | undefined) => {
        if (isActive) {
            return <Badge variant="default" className="bg-green-600 hover:bg-green-700">نشط</Badge>;
        } else {
            return <Badge variant="secondary" className="bg-gray-500 hover:bg-gray-600">غير نشط</Badge>;
        }
    };

    const getPermissionLabels = (permissions: string[] | null) => {
        if (!permissions || permissions.length === 0) return 'لا توجد صلاحيات محددة';

        const permissionMap: Record<string, string> = {
            'USER_MANAGEMENT': 'إدارة المستخدمين',
            'ORDER_MANAGEMENT': 'إدارة الطلبات',
            'PRODUCT_MANAGEMENT': 'إدارة المنتجات',
            'REPORT_VIEWING': 'عرض التقارير',
            'SYSTEM_SETTINGS': 'إعدادات النظام',
            'FINANCIAL_MANAGEMENT': 'إدارة المالية',
        };

        return permissions.map(p => permissionMap[p] || p).join(', ');
    };

    return (
        <Card className='overflow-hidden rounded-lg border border-purple-200 bg-background text-foreground shadow-md transition-shadow hover:shadow-lg'>
            {/* Card Header with Admin-specific styling */}
            <CardHeader className='border-b border-purple-200 bg-purple-50/50 p-4'>
                <div className='flex items-center justify-between'>
                    <CardTitle className='line-clamp-1 text-lg font-semibold text-purple-700'>
                        {safeAdmin.name}
                    </CardTitle>
                    <div className='flex items-center gap-2'>
                        {getAdminLevelBadge(admin.adminLevel)}
                        {getStatusBadge(admin.isActive)}
                    </div>
                </div>
            </CardHeader>

            {/* Card Content */}
            <CardContent className='space-y-4 p-4'>
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted/20">
                    <AddImage
                        url={safeAdmin.imageUrl}
                        alt={`${safeAdmin.name}'s profile`}
                        recordId={safeAdmin.id}
                        table="user"
                        tableField='image'
                        onUploadComplete={() => toast.success("تم رفع الصورة بنجاح")}
                    />
                </div>

                {/* Admin Details */}
                <div className='space-y-2'>
                    <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Icon name="Mail" size="xs" className="text-purple-600" />
                        <strong className='font-medium'>Email:</strong> {safeAdmin.email || 'No Email'}
                    </p>
                    <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Icon name="Phone" size="xs" className="text-purple-600" />
                        <strong className='font-medium'>Phone:</strong> {safeAdmin.phone || 'No Phone'}
                    </p>

                    {/* Admin Level */}
                    {admin.adminLevel && (
                        <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Icon name="Shield" size="xs" className="text-purple-600" />
                            <strong className='font-medium'>Level:</strong> {getAdminLevelBadge(admin.adminLevel)}
                        </p>
                    )}

                    {/* Permissions */}
                    {admin.permissions && admin.permissions.length > 0 && (
                        <div className='flex items-start gap-2 text-sm text-muted-foreground'>
                            <Icon name="Key" size="xs" className="text-purple-600 mt-0.5" />
                            <div>
                                <strong className='font-medium'>Permissions:</strong>
                                <p className="text-xs mt-1 line-clamp-2">{getPermissionLabels(admin.permissions)}</p>
                            </div>
                        </div>
                    )}

                    {/* Status */}
                    <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Icon name="Circle" size="xs" className={`${admin.isActive ? 'text-green-600' : 'text-gray-500'}`} />
                        <strong className='font-medium'>Status:</strong> {getStatusBadge(admin.isActive)}
                    </p>

                    {/* Address Information */}
                    {admin.addresses && admin.addresses.length > 0 ? (
                        admin.addresses.map((address) => (
                            <div key={address.id} className='space-y-1'>
                                <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                                    <Icon name="MapPin" size="xs" className="text-purple-600" />
                                    <strong className='font-medium'>{address.label}:</strong>
                                </p>
                                <p className='text-xs text-muted-foreground mr-6'>
                                    {address.district}, {address.street}, مبنى {address.buildingNumber}
                                    {address.apartmentNumber && `، شقة ${address.apartmentNumber}`}
                                    {address.floor && `، طابق ${address.floor}`}
                                    {address.landmark && `، معلم: ${address.landmark}`}
                                </p>
                                {address.latitude && address.longitude && (
                                    <div className='flex items-center gap-2 text-xs text-muted-foreground mr-6'>
                                        <GoogleMapsLink
                                            latitude={address.latitude}
                                            longitude={address.longitude}
                                            label="عرض على الخريطة"
                                            variant="ghost"
                                            size="sm"
                                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Icon name="MapPin" size="xs" className="text-purple-600" />
                            <strong className='font-medium'>Address:</strong> No Address
                        </p>
                    )}
                </div>
            </CardContent>

            {/* Card Footer with Admin-specific actions */}
            <CardFooter className='flex justify-between border-t border-purple-200 bg-purple-50/30 p-4'>
                <AdminUpsert
                    mode='update'
                    title="تعديل بيانات المشرف"
                    description="يرجى إدخال بيانات المشرف المحدثة"
                    defaultValues={{
                        name: admin.name,
                        email: admin.email || '',
                        phone: admin.phone || '',
                        addressLabel: admin.addresses?.[0]?.label || 'العمل',
                        district: admin.addresses?.[0]?.district || '',
                        street: admin.addresses?.[0]?.street || '',
                        buildingNumber: admin.addresses?.[0]?.buildingNumber || '',
                        floor: admin.addresses?.[0]?.floor || '',
                        apartmentNumber: admin.addresses?.[0]?.apartmentNumber || '',
                        landmark: admin.addresses?.[0]?.landmark || '',
                        deliveryInstructions: admin.addresses?.[0]?.deliveryInstructions || '',
                        password: admin.password || '',
                        sharedLocationLink: admin.sharedLocationLink || '',
                        latitude: admin.addresses?.[0]?.latitude || admin.latitude || '',
                        longitude: admin.addresses?.[0]?.longitude || admin.longitude || '',
                        adminLevel: (admin.adminLevel as 'ADMIN' | 'SUPER_ADMIN' | 'MODERATOR') || 'ADMIN',
                        permissions: admin.permissions || [],
                        isActive: admin.isActive ?? true,
                    }}
                    adminId={admin.id}
                />

                {/* Delete Admin Alert */}
                <DeleteAdminAlert adminId={safeAdmin.id}>
                    <button className='flex items-center gap-1 text-destructive hover:underline'>
                        <Icon name="Trash2" size="xs" />
                    </button>
                </DeleteAdminAlert>
            </CardFooter>
        </Card>
    );
} 