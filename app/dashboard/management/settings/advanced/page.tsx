import SettingsLayout from '../components/SettingsLayout';
import { ChevronDown, Wrench } from 'lucide-react';
import { fetchCompany } from '../actions/fetchCompany';
import CloudinarySettingsForm from './components/forms/CloudinarySettingsForm';
import WhatsAppSettingsForm from './components/forms/WhatsAppSettingsForm';
import EmailSmtpSettingsForm from './components/forms/EmailSmtpSettingsForm';
import AnalyticsSettingsForm from './components/forms/AnalyticsSettingsForm';
import AuthSettingsForm from './components/forms/AuthSettingsForm';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

export default async function AdvancedSettingsPage() {
  const company = await fetchCompany();
  // Compute progress: count how many advanced fields are filled
  const fields: (keyof NonNullable<typeof company>)[] = [
    'cloudinaryCloudName', 'cloudinaryApiKey', 'cloudinaryApiSecret', 'cloudinaryUploadPreset', 'cloudinaryClientFolder',
    'whatsappPermanentToken', 'whatsappPhoneNumberId', 'whatsappApiVersion', 'whatsappBusinessAccountId', 'whatsappWebhookVerifyToken', 'whatsappAppSecret', 'whatsappNumber',
    'emailUser', 'emailPass', 'smtpHost', 'smtpPort', 'smtpUser', 'smtpPass', 'smtpFrom',
    'gtmContainerId',
    // Pusher & VAPID forms are hidden, exclude from progress calculation
    'authCallbackUrl'
  ];
  const total = fields.length;
  const current = fields.filter((f) => {
    const v = company?.[f as keyof typeof company];
    return typeof v === 'string' ? v.trim() !== '' : !!v;
  }).length;
  const isComplete = current === total;

  return (
    <SettingsLayout
      title="إعدادات متقدمة"
      description="إعدادات تكوين متقدمة للخدمات الخارجية"
      icon={Wrench}
      progress={{ current, total, isComplete }}
    >
      <div className="grid gap-6">
        <Collapsible defaultOpen={false}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">إعدادات الوسائط</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="group gap-2">
                <span className="group-data-[state=open]:hidden">عرض</span>
                <span className="hidden group-data-[state=open]:inline">إخفاء</span>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="pt-4">
            <CloudinarySettingsForm company={company || undefined} />
          </CollapsibleContent>
        </Collapsible>
        <Collapsible defaultOpen={false}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">إعدادات التفعيل عن طريق واتس اب</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="group gap-2">
                <span className="group-data-[state=open]:hidden">عرض</span>
                <span className="hidden group-data-[state=open]:inline">إخفاء</span>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="pt-4">
            <WhatsAppSettingsForm company={company || undefined} />
          </CollapsibleContent>
        </Collapsible>
        <Collapsible defaultOpen={false}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">إعدادات البريد / SMTP</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="group gap-2">
                <span className="group-data-[state=open]:hidden">عرض</span>
                <span className="hidden group-data-[state=open]:inline">إخفاء</span>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="pt-4">
            <EmailSmtpSettingsForm company={company || undefined} />
          </CollapsibleContent>
        </Collapsible>
        <Collapsible defaultOpen={false}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">إعدادات التحليلات (GTM)</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="group gap-2">
                <span className="group-data-[state=open]:hidden">عرض</span>
                <span className="hidden group-data-[state=open]:inline">إخفاء</span>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="pt-4">
            <AnalyticsSettingsForm company={company || undefined} />
          </CollapsibleContent>
        </Collapsible>
        <Collapsible defaultOpen={false}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">إعدادات المصادقة</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="group gap-2">
                <span className="group-data-[state=open]:hidden">عرض</span>
                <span className="hidden group-data-[state=open]:inline">إخفاء</span>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="pt-4">
            <AuthSettingsForm company={company || undefined} />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </SettingsLayout>
  );
}


