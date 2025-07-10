import AddImage from '@/components/AddImage';
import { fetchCompany } from './actions/fetchCompany';
import CompanyProfileForm from './component/CompanyProfileForm';
import { Settings2 } from 'lucide-react';

export default async function SettingsPage() {
  const companyData = await fetchCompany();

  return (
    <div className="container mx-auto bg-background p-4 text-foreground">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">إعدادات المنصة</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          في هذه الصفحة يمكنك إدارة المعلومات العامة لمنصتك، مثل الهوية البصرية، وبيانات الشركة، وروابط التواصل، وغيرها من التفاصيل المهمة.
        </p>
      </div>

      {/* Main Alert */}
      <div className="mb-10 flex items-start gap-3 rounded-lg border border-yellow-400 bg-yellow-100 p-4 text-sm text-yellow-900 dark:border-yellow-600 dark:bg-yellow-900 dark:text-yellow-100">
        <span className="mt-0.5 text-lg">🛠️</span>
        <p>
          <strong>تنبيه مهم:</strong> إعدادات المنصة تُعد العمود الفقري لتجربة المستخدم وهوية شركتك الرقمية. تأكد من إدخال معلومات دقيقة ومحدثة لضمان أفضل أداء واحترافية في العرض.
        </p>
      </div>

      {/* Logo Section */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/10 p-6 shadow-sm mb-10">
        <div className="mb-6 flex flex-col items-start">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            شعار الشركة
          </h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            يُعد الشعار جزءًا أساسيًا من هوية منصتك. يُنصح باستخدام صورة عالية الجودة تمثل علامتك التجارية بوضوح.
          </p>
        </div>
        <div className="p-2 group h-28 w-36 overflow-hidden rounded-lg border border-dashed border-muted hover:border-primary hover:bg-muted/40 transition-colors duration-200 cursor-pointer">
          <AddImage
            url={companyData?.logo || ''}
            alt={`${companyData?.fullName || 'الشركة'} شعار`}
            recordId={companyData?.id || ''}
            table="company"
            tableField="logo"
          />

        </div>
      </div>

      {/* Form Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">معلومات الشركة</h2>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          أدخل بيانات شركتك الأساسية مثل الاسم، العنوان، أرقام التواصل، والضرائب لتظهر بشكل احترافي للمستخدمين والعملاء.
        </p>
        <CompanyProfileForm company={companyData} />
      </div>
    </div>
  );
}
