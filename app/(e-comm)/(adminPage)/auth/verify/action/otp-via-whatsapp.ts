'use server';

import { generateOTP } from '@/lib/otp-Generator';
import { sendMessage } from '@/lib/whatapp-cloud-api';
import db from '@/lib/prisma';
import { auth } from '@/auth';

// Rate limiting helper
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const key = `otp_${userId}`;
  const limit = rateLimitStore.get(key);
  
  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + 60 * 60 * 1000 });
    return true;
  }
  
  if (limit.count >= 5) {
    return false;
  }
  
  limit.count++;
  return true;
};

// WhatsApp message template
const createOTPMessage = (otp: string, appName: string = 'متجرنا الإلكتروني') => {
  return `🔐 رمز التحقق الخاص بك

رمز التحقق: *${otp}*

⏰ هذا الرمز صالح لمدة 10 دقائق فقط

⚠️ لا تشارك هذا الرمز مع أي شخص

إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.

شكراً لك
${appName}`;
};

// OTP via WhatsApp handler - Session-based
export const otpViaWhatsApp = async () => {
  try {
    // Get user from session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const userId = session.user.id;
    const userPhone = session.user.phone;

    if (!userPhone) {
      return {
        success: false,
        message: 'رقم الهاتف غير متوفر في الحساب'
      };
    }

    // Check rate limiting
    if (!checkRateLimit(userId)) {
      return {
        success: false,
        message: 'تم تجاوز الحد الأقصى للمحاولات. يرجى المحاولة لاحقاً'
      };
    }

    const { token, expires } = generateOTP();

    // Update user with OTP using user ID
    await db.user.update({
      where: { id: userId },
      data: { 
        otpCode: token, 
        isOtp: false 
      }
    });

    // In development mode, always return fake OTP for testing
    if (process.env.NODE_ENV === 'development' || !process.env.WHATSAPP_ACCESS_TOKEN) {
      return {
        success: true,
        message: 'تم إرسال رمز التحقق (وهمي)',
        token,
        expires,
        phoneNumber: userPhone,
        isFake: true
      };
    }

    // In production, send real WhatsApp message
    const message = createOTPMessage(token);
    await sendMessage(userPhone, message);

    return {
      success: true,
      message: 'تم إرسال رمز التحقق عبر WhatsApp',
      expires,
      phoneNumber: userPhone,
      isFake: false
    };

  } catch (error) {
    console.error('Error in otpViaWhatsApp:', error);
    return {
      success: false,
      message: 'خطأ في الخادم. يرجى المحاولة مرة أخرى'
    };
  }
};

// Verify OTP - Session-based
export const verifyTheUser = async (code: string) => {
  try {
    // Get user from session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const userId = session.user.id;

    // Get user with OTP data
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        otpCode: true, 
        isOtp: true,
        phone: true
      }
    });

    if (!user) {
      return {
        success: false,
        message: 'لم يتم العثور على المستخدم'
      };
    }

    if (!user.otpCode) {
      return {
        success: false,
        message: 'لم يتم إرسال رمز التحقق. يرجى طلب رمز جديد'
      };
    }

    if (user.otpCode !== code) {
      return {
        success: false,
        message: 'رمز التحقق غير صحيح'
      };
    }

    // Update user status using user ID
    await db.user.update({
      where: { id: userId },
      data: { 
        isOtp: true, 
        isActive: true, 
        otpCode: null // Clear OTP after successful verification
      }
    });

    return {
      success: true,
      message: 'تم التحقق من الرمز بنجاح'
    };

  } catch (error) {
    console.error('Error in verifyTheUser:', error);
    return {
      success: false,
      message: 'خطأ في الخادم. يرجى المحاولة مرة أخرى'
    };
  }
};

// Resend OTP with cooldown - Session-based
export const resendOTP = async () => {
  try {
    // Get user from session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const userId = session.user.id;

    // Check cooldown
    const cooldownKey = `cooldown_${userId}`;
    const cooldown = rateLimitStore.get(cooldownKey);
    const now = Date.now();
    
    if (cooldown && now < cooldown.resetTime) {
      const remainingSeconds = Math.ceil((cooldown.resetTime - now) / 1000);
      return { 
        success: false, 
        message: `يرجى الانتظار ${remainingSeconds} ثانية قبل إعادة الإرسال` 
      };
    }

    // Set cooldown
    rateLimitStore.set(cooldownKey, { 
      count: 1, 
      resetTime: now + 2 * 60 * 1000 // 2 minutes cooldown
    });

    // Send new OTP
    return await otpViaWhatsApp();

  } catch (error) {
    console.error('Error in resendOTP:', error);
    return { 
      success: false, 
      message: 'خطأ في الخادم. يرجى المحاولة مرة أخرى' 
    };
  }
}; 