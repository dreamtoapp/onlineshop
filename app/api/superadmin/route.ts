import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json();

    // Check superadmin credentials
    if (phone === 'dreamtoapp' && password === 'dreamtoapp123456') {

      // Check if user exists
      const existingUser = await db.user.findUnique({
        where: { phone: 'dreamtoapp' }
      });

      let user = existingUser;

      if (!existingUser) {
        // Create superadmin user
        user = await db.user.create({
          data: {
            phone: 'dreamtoapp',
            password: 'dreamtoapp123456',
            name: 'Super Admin',
            role: 'ADMIN',
            isOtp: false,
            isOauth: false
          }
        });
        console.log('✅ Superadmin user created:', user.id);
      } else {
        console.log('ℹ️ Superadmin user already exists:', existingUser.id);
      }

      // 🎯 Always check and create company record if none exists
      const existingCompany = await db.company.findFirst();
      if (!existingCompany) {
        const newCompany = await db.company.create({
          data: {
            fullName: 'Dream To App',
            email: 'info@dreamto.app',
            phoneNumber: '0500000000',
            whatsappNumber: '0500000000',
            logo: '',
            profilePicture: '',
            bio: 'نحن شركة متخصصة في تحويل الأفكار إلى تطبيقات - فرعنا الالكتروني لتوفير المنتجات المميزة لعملائنا الكرام',
            website: 'https://dreamto.app',
            address: 'المملكة العربية السعودية',
            taxPercentage: 15,
            taxNumber: '',
            taxQrImage: '',
            workingHours: '24/7',
            minShipping: 0,
            shippingFee: 0,
            online: true,
            twitter: '',
            linkedin: '',
            instagram: '',
            tiktok: '',
            facebook: '',
            snapchat: ''
          }
        });
        console.log('✅ Company record created:', newCompany.id);
      } else {
        console.log('ℹ️ Company record already exists:', existingCompany.id);
      }

      const message = existingUser
        ? 'Superadmin login successful'
        : 'Superadmin and company record created successfully';

      return NextResponse.json({
        success: true,
        message,
        user
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid superadmin credentials'
    }, { status: 401 });

  } catch (error) {
    console.error('Superadmin API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
} 