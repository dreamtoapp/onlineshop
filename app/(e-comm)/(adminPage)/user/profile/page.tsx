import { redirect } from 'next/navigation';

import EmptyState from '@/components/warinig-msg';
import getSession from '@/lib/getSession';
import { userProfile } from './action/action';
import UserProfileForm from './component/update-profile';

async function ProfilePage() {
  const session = await getSession();
  const user = session?.user;

  if (!user || !user.id) {
    return redirect('/auth/login');
  }

  const userData = await userProfile(user.id);

  if (!userData) {
    return <EmptyState message='لم يتم العثور على بيانات المستخدم' />;
  }

  return <UserProfileForm
    userData={{
      id: userData.id ?? '',
      image: userData.image ?? '',
      name: userData.name ?? '',
      email: userData.email ?? '',
      phone: userData.phone ?? '',
      password: userData.password ?? '',
    }}
    isOtp={userData.isOtp}
  />;
}

export default ProfilePage;
