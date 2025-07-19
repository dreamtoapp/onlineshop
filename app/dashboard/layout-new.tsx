import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { UserRole } from '@prisma/client';
import NotificationPortal from '@/components/ui/NotificationPortal';
import ServiceWorkerRegistration from '@/app/components/ServiceWorkerRegistration';
import DashboardNav from './components/DashboardNav';

export default async function LayoutNew({ children }: { children: React.ReactNode }) {
    // This layout is used for the dashboard pages
    const session = await auth();
    // Fix: Accept both string and enum for role, and handle legacy lowercase roles
    const userRole = (session?.user as { role?: string })?.role;
    if (!session?.user || (userRole !== UserRole.ADMIN && userRole !== 'ADMIN')) {
        return redirect('/auth/login');
    }

    // Hardcode RTL for now; in the future, detect from language/i18n
    return (
        <div className='flex min-h-screen w-full bg-background' dir='rtl'>
            {/* Top Navigation Bar */}
            <DashboardNav />

            {/* Main Content Area */}
            <div className='flex min-h-screen flex-1 flex-col pt-16'>
                <main className='w-full flex-1 bg-background p-6'>
                    {children}
                </main>

                {/* Footer */}
                <footer className='border-t bg-background/80 backdrop-blur-sm px-6 py-4'>
                    <div className='flex items-center justify-between text-sm text-muted-foreground'>
                        <div className='flex items-center gap-4'>
                            <span>© 2024 متجر. جميع الحقوق محفوظة.</span>
                            <span>•</span>
                            <span>الإصدار 1.0.0</span>
                        </div>
                        <div className='flex items-center gap-4'>
                            <span>الحالة: متصل</span>
                            <span>•</span>
                            <span>آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</span>
                        </div>
                    </div>
                </footer>
            </div>

            <NotificationPortal />
            <ServiceWorkerRegistration />
        </div>
    );
} 