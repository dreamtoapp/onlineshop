import { redirect } from 'next/navigation';

import AppSidebar
  from '@/app/dashboard/management-dashboard/components/AppSidebar'; // Enhanced sidebar
import { auth } from '@/auth';
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { UserRole } from '@prisma/client';

import EnhancedBreadcrumb from './management-dashboard/components/EnhancedBreadcrumb';
import QuickActions from './management-dashboard/components/QuickActions';
import PusherNotify from '@/app/dashboard/management/PusherNotify';
import NotificationPortal from '@/components/ui/NotificationPortal';

export default async function Layout({ children }: { children: React.ReactNode }) {
  // This layout is used for the dashboard pages
  const session = await auth();
  // Fix: Accept both string and enum for role, and handle legacy lowercase roles
  const userRole = (session?.user as { role?: string })?.role;
  if (!session?.user || (userRole !== UserRole.ADMIN && userRole !== 'ADMIN')) {
    return redirect('/auth/login');
  }



  // Hardcode RTL for now; in the future, detect from language/i18n
  return (
    <SidebarProvider defaultOpen={true}>
      <div className='flex min-h-screen w-full bg-background ' dir='rtl'>
        <AppSidebar /> {/* Reverted to use the old sidebar */}
        <div className='flex min-h-screen flex-1 flex-col'>
          {/* Enhanced Sticky header */}
          <header className='sticky top-0 z-40 flex items-center justify-between border-b bg-background/80 backdrop-blur-sm px-6 py-3 shadow-sm'>
            <div className='flex items-center gap-4 flex-1'>
              <SidebarTrigger />
              <EnhancedBreadcrumb />
            </div>
            <div className='flex items-center gap-3'>
              <QuickActions />
              <PusherNotify />
            </div>
          </header>
          {/* Main content */}
          <main className='w-full flex-1 bg-background p-6'>{children}</main>
        </div>
      </div>
      <NotificationPortal />
    </SidebarProvider>
  );
}
