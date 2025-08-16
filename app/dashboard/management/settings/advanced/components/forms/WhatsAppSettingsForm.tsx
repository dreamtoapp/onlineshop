"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import { Users, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { updateCompany } from '../../actions/updateCompany';
import UserActivationDialog from './UserMigrationDialog';

interface WhatsAppSettingsFormProps {
  company?: {
    whatsappBusinessAccountId?: string;
    whatsappPhoneNumberId?: string;
    whatsappPermanentToken?: string;
    whatsappAccessToken?: string;
    requireWhatsappOtp?: boolean;
  };
}

export default function WhatsAppSettingsForm({ company }: WhatsAppSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showActivationDialog, setShowActivationDialog] = useState(false);

  // Simple form state without complex schema
  const [formData, setFormData] = useState({
    whatsappBusinessAccountId: company?.whatsappBusinessAccountId || '',
    whatsappPhoneNumberId: company?.whatsappPhoneNumberId || '',
    whatsappPermanentToken: company?.whatsappPermanentToken || '',
    whatsappAccessToken: company?.whatsappAccessToken || '',
    requireWhatsappOtp: company?.requireWhatsappOtp ?? false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Filter out empty values but keep boolean false values
      const payload = Object.entries(formData).filter(([, v]) => {
        if (typeof v === 'boolean') return true; // Always include boolean values
        if (typeof v === 'string') return v.trim() !== '';
        return v !== undefined;
      });

      const result = await updateCompany(Object.fromEntries(payload));

      if (result.success) {
        toast.success('تم حفظ الإعدادات بنجاح');
      } else {
        toast.error(result.message || 'فشل في حفظ الإعدادات');
      }
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivateUsers = async (userIds: string[]) => {
    try {
      const response = await fetch('/api/users/migrate-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        return Promise.resolve();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Activation failed');
      }
    } catch (error) {
      console.error('Activation error:', error);
      toast.error('فشل في تفعيل المستخدمين');
      return Promise.reject(error);
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-3">
        {/* OTP Toggle Section */}
        <div className="grid gap-2 p-3 border rounded-lg bg-card/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="requireWhatsappOtp" className="text-base font-medium">
                تفعيل التحقق عبر WhatsApp OTP
              </Label>
              <p className="text-sm text-muted-foreground">
                عند التفعيل: سيُطلب من المستخدمين إدخال رمز التحقق المرسل عبر WhatsApp عند تسجيل الدخول
              </p>
              <p className="text-xs text-muted-foreground">
                عند الإلغاء: تسجيل الدخول مباشرة بدون OTP
              </p>
            </div>
            <Switch
              id="requireWhatsappOtp"
              checked={formData.requireWhatsappOtp}
              onCheckedChange={(checked) => handleInputChange('requireWhatsappOtp', checked)}
            />
          </div>
        </div>

        {/* Conditional WhatsApp Configuration */}
        {formData.requireWhatsappOtp && (
          <div className="space-y-3 p-3 border rounded-lg bg-card w-full">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>⚙️</span>
              <span>تكوين WhatsApp مطلوب لتفعيل OTP</span>
            </div>

            <div className="grid gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="whatsappBusinessAccountId">معرف حساب الأعمال</Label>
                <Input
                  id="whatsappBusinessAccountId"
                  value={formData.whatsappBusinessAccountId}
                  onChange={(e) => handleInputChange('whatsappBusinessAccountId', e.target.value)}
                  placeholder="أدخل معرف حساب الأعمال"
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="whatsappPhoneNumberId">معرف رقم الهاتف</Label>
                <Input
                  id="whatsappPhoneNumberId"
                  value={formData.whatsappPhoneNumberId}
                  onChange={(e) => handleInputChange('whatsappPhoneNumberId', e.target.value)}
                  placeholder="أدخل معرف رقم الهاتف"
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="whatsappPermanentToken">الرمز المميز الدائم</Label>
                <Textarea
                  id="whatsappPermanentToken"
                  value={formData.whatsappPermanentToken}
                  onChange={(e) => handleInputChange('whatsappPermanentToken', e.target.value)}
                  placeholder="أدخل الرمز المميز الدائم"
                  rows={2}
                  className="resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="whatsappAccessToken">رمز الوصول</Label>
                <Textarea
                  id="whatsappAccessToken"
                  value={formData.whatsappAccessToken}
                  onChange={(e) => handleInputChange('whatsappAccessToken', e.target.value)}
                  placeholder="أدخل رمز الوصول"
                  rows={2}
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Migration Section when OTP is disabled */}
        {!formData.requireWhatsappOtp && (
          <div className="p-3 border rounded-lg bg-muted w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>ℹ️</span>
                <span>WhatsApp OTP معطل. لا حاجة لتكوين WhatsApp في الوقت الحالي.</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowActivationDialog(true)}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                تفعيل المستخدمين
              </Button>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData({
              whatsappBusinessAccountId: company?.whatsappBusinessAccountId || '',
              whatsappPhoneNumberId: company?.whatsappPhoneNumberId || '',
              whatsappPermanentToken: company?.whatsappPermanentToken || '',
              whatsappAccessToken: company?.whatsappAccessToken || '',
              requireWhatsappOtp: company?.requireWhatsappOtp ?? false,
            })}
            disabled={isSubmitting}
          >
            إعادة تعيين
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                جاري الحفظ...
              </>
            ) : (
              'حفظ'
            )}
          </Button>
        </div>
      </form>

      {/* Activation Dialog */}
      <UserActivationDialog
        open={showActivationDialog}
        onOpenChange={setShowActivationDialog}
        onMigrate={handleActivateUsers}
      />
    </>
  );
}


