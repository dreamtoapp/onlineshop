import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Star, Home, Building, MapPin, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import GoogleMapsLink from '@/components/GoogleMapsLink';
import type { Address } from '@prisma/client';
import { formatFullAddress } from '../helpers';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
  settingDefaultId: string | null;
  showDefaultDeleteAlert: boolean;
  onShowDefaultDeleteAlert: (show: boolean) => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  settingDefaultId,
  showDefaultDeleteAlert,
  onShowDefaultDeleteAlert
}: AddressCardProps) {
  const getAddressIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'المنزل':
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'العمل':
      case 'work':
        return <Building className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <Card className="shadow-lg border-l-4 border-l-feature-users">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            {getAddressIcon(address.label)}
            <span>{address.label}</span>
            {address.isDefault && (
              <Badge variant="secondary" className="bg-feature-users-soft text-feature-users">
                <Star className="h-3 w-3 ml-1" />
                افتراضي
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(address)}
              className="text-feature-users hover:bg-feature-users-soft"
            >
              <Edit className="h-4 w-4" />
            </Button>
            {address.isDefault ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => onShowDefaultDeleteAlert(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <AlertDialog open={showDefaultDeleteAlert} onOpenChange={onShowDefaultDeleteAlert}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>لا يمكن حذف العنوان الافتراضي</AlertDialogTitle>
                      <AlertDialogDescription>
                        يجب تعيين عنوان افتراضي آخر قبل حذف هذا العنوان. يرجى اختيار عنوان آخر كافتراضي ثم حاول مرة أخرى.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction onClick={() => onShowDefaultDeleteAlert(false)} autoFocus>
                        فهمت
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>حذف العنوان</AlertDialogTitle>
                    <AlertDialogDescription>
                      هل أنت متأكد من حذف هذا العنوان؟ لا يمكن التراجع عن هذا الإجراء.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(address.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      حذف
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="font-medium">
            {formatFullAddress(address)}
          </p>
          {address.landmark && (
            <p className="text-sm text-muted-foreground">
              قريب من: {address.landmark}
            </p>
          )}
          {address.deliveryInstructions && (
            <p className="text-sm text-muted-foreground">
              تعليمات التوصيل: {address.deliveryInstructions}
            </p>
          )}
          {address.latitude && address.longitude && (
            <div className="mt-2">
              <GoogleMapsLink
                latitude={address.latitude}
                longitude={address.longitude}
                label="عرض على الخريطة"
                variant="ghost"
                size="sm"
                className="text-feature-users hover:text-feature-users/80 hover:bg-feature-users/10"
              />
            </div>
          )}
        </div>
        {!address.isDefault && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetDefault(address.id)}
              className="w-full"
              disabled={settingDefaultId === address.id}
            >
              {settingDefaultId === address.id ? (
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              ) : (
                <Star className="h-4 w-4 ml-2" />
              )}
              تعيين كافتراضي
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
