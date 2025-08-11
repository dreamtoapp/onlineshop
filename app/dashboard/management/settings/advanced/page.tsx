import SettingsLayout from '../components/SettingsLayout';
import { Wrench } from 'lucide-react';
import { fetchCompany } from '../actions/fetchCompany';
import CloudinarySettingsForm from './components/forms/CloudinarySettingsForm';
import WhatsAppSettingsForm from './components/forms/WhatsAppSettingsForm';
import EmailSmtpSettingsForm from './components/forms/EmailSmtpSettingsForm';
import AnalyticsSettingsForm from './components/forms/AnalyticsSettingsForm';
import PusherSettingsForm from './components/forms/PusherSettingsForm';
import VapidSettingsForm from './components/forms/VapidSettingsForm';
import AuthSettingsForm from './components/forms/AuthSettingsForm';

export default async function AdvancedSettingsPage() {
  const company = await fetchCompany();
  // Compute progress: count how many advanced fields are filled
  const fields: (keyof NonNullable<typeof company>)[] = [
    'cloudinaryCloudName', 'cloudinaryApiKey', 'cloudinaryApiSecret', 'cloudinaryUploadPreset', 'cloudinaryClientFolder',
    'whatsappPermanentToken', 'whatsappPhoneNumberId', 'whatsappApiVersion', 'whatsappBusinessAccountId', 'whatsappWebhookVerifyToken', 'whatsappAppSecret', 'whatsappNumber',
    'emailUser', 'emailPass', 'smtpHost', 'smtpPort', 'smtpUser', 'smtpPass', 'smtpFrom',
    'gtmContainerId',
    'pusherAppId', 'pusherKey', 'pusherSecret', 'pusherCluster',
    'vapidPublicKey', 'vapidPrivateKey', 'vapidSubject', 'vapidEmail',
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
        <CloudinarySettingsForm company={company} />
        <WhatsAppSettingsForm company={company} />
        <EmailSmtpSettingsForm company={company} />
        <AnalyticsSettingsForm company={company} />
        <PusherSettingsForm company={company} />
        <VapidSettingsForm company={company} />
        <AuthSettingsForm company={company} />
      </div>
    </SettingsLayout>
  );
}


