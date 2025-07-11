import Fotter from './homepage/component/Fotter/Fotter';
// import Header from './homepage/component/Header/DesktopHeader';
// import MobileHeader from './homepage/component/Header/MobileHeader';
import HeaderUnified from './homepage/component/Header/HeaderUnified';
import MobileBottomNav from './homepage/component/Header/MobileBottomNav';
// app/(ecommerce)/layout.tsx
import { WishlistProvider } from '@/providers/wishlist-provider';
import { fetchEcommLayoutData } from './helpers/layoutData';
import FilterAlert from '@/components/FilterAlert';

// Server component: fetch all layout data via helper
export default async function EcommerceLayout({ children }: { children: React.ReactNode }) {
  try {
    // Use helper to fetch and prepare all layout data
    const {
      companyData,
      session,
      user,
      userSummary,
      notificationCount,
      wishlistIds,
      alerts,
      fullUser,
      productCount,
      clientCount,
    } = await fetchEcommLayoutData();
    const typedCompanyData = companyData as any;

    // Remove hardcoded values, use real data
    // console.log(productCount, clientCount);

    // Debug login state
    // console.log('HeaderUnified debug:', debug);

    return (
      <WishlistProvider initialIds={wishlistIds}>
        <div className="flex flex-col min-h-screen">
          {/* Desktop & Mobile Unified Header */}
          <HeaderUnified
            user={userSummary}
            unreadCount={notificationCount}
            defaultAlerts={alerts}
            logo={typedCompanyData?.logo || ''}
            logoAlt={typedCompanyData?.fullName || 'Dream to app'}
            isLoggedIn={!!session}
          />
          {/*
          <div className="hidden md:block">
            <Header
              user={userSummary}
              userId={user?.id}
              unreadCount={notificationCount}
              defaultAlerts={alerts}
              logo={typedCompanyData?.logo || ''}
              logoAlt={typedCompanyData?.fullName || 'Dream to app'}
            />
          </div>
          <div className="md:hidden">
            <MobileHeader
              user={userSummary}
              logo={typedCompanyData?.logo || ''}
              logoAlt={typedCompanyData?.fullName || 'Dream to app'}
              isLoggedIn={!!session}
              alerts={alerts}
              unreadCount={notificationCount}
            />
          </div>
          */}
          <FilterAlert />
          <MobileBottomNav
            isLoggedIn={!!session}
            userImage={fullUser?.image}
            userName={fullUser?.name}
            whatsappNumber={typedCompanyData?.whatsappNumber}
            userId={user?.id}
          />

          {/* Mobile-First Main Content */}
          <main className='flex-grow'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6'>
              {children}
            </div>
          </main>
          <Fotter
            companyName={typedCompanyData?.fullName}
            aboutus={typedCompanyData?.bio}
            email={typedCompanyData?.email}
            phone={typedCompanyData?.phoneNumber}
            address={typedCompanyData?.address}
            facebook={typedCompanyData?.facebook}
            instagram={typedCompanyData?.instagram}
            twitter={typedCompanyData?.twitter}
            linkedin={typedCompanyData?.linkedin}
            productCount={productCount}
            clientCount={clientCount}
          />
        </div>
      </WishlistProvider>
    );
  } catch (e) {
    // Show fallback UI on error
    return <div>حدث خطأ أثناء تحميل الصفحة. الرجاء المحاولة لاحقًا.</div>;
  }
}
