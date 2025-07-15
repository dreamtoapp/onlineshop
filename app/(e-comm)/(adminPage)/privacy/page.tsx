
export default function PrivacyPage() {
    return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
            <h1 className="text-3xl font-bold mb-6 text-foreground">سياسة الخصوصية</h1>
            <div className="space-y-4 text-muted-foreground">
                <p>
                    نحن نولي أهمية كبيرة لخصوصيتك وحماية بياناتك الشخصية. تهدف هذه الصفحة إلى توضيح كيفية جمع واستخدام وحماية المعلومات التي تقدمها لنا عند استخدامك لموقعنا.
                </p>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">المعلومات التي نجمعها</h2>
                <ul className="list-disc pl-6">
                    <li>معلومات الحساب مثل الاسم، البريد الإلكتروني، ورقم الهاتف.</li>
                    <li>بيانات الطلبات والمعاملات.</li>
                    <li>معلومات التصفح واستخدام الموقع لتحسين تجربتك.</li>
                </ul>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">كيف نستخدم المعلومات</h2>
                <ul className="list-disc pl-6">
                    <li>لتقديم الخدمات وتحسين تجربة المستخدم.</li>
                    <li>للتواصل معك بشأن الطلبات أو العروض أو التحديثات.</li>
                    <li>لحماية الموقع والمستخدمين من أي استخدام غير قانوني.</li>
                </ul>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">حماية المعلومات</h2>
                <p>
                    نتخذ جميع الإجراءات اللازمة لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الكشف أو الإتلاف.
                </p>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">حقوقك</h2>
                <ul className="list-disc pl-6">
                    <li>يحق لك طلب معرفة أو تحديث أو حذف بياناتك الشخصية في أي وقت.</li>
                    <li>لديك الحق في التواصل معنا لأي استفسار حول خصوصيتك.</li>
                </ul>
                <p className="mt-8">إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا عبر صفحة <a href="/contact" className="text-primary underline">تواصل معنا</a>.</p>
            </div>
        </div>
    );
} 