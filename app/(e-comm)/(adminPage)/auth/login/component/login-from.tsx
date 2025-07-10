'use client';
import { useActionState } from 'react';
import { Eye, EyeOff, Loader2, Shield, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { log } from '@/utils/logger';
import { userLogin } from '../action/userLogin';
import BackButton from '@/components/BackButton';

interface LoginFormProps {
  redirect?: string;
}

// Login Header Component (15 lines)
function LoginHeader() {
  return (
    <div className="text-center mb-8">
      <Shield className="h-12 w-12 text-feature-users mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-foreground mb-2">مرحباً بعودتك!</h1>
      <p className="text-muted-foreground">أدخل بياناتك لتسجيل الدخول إلى حسابك</p>
    </div>
  );
}

// Form Fields Component (35 lines)
function FormFields({
  showPassword,
  setShowPassword
}: {
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Phone Input */}
      <div>
        <Input
          type="tel"
          name="phone"
          placeholder="رقم الهاتف (05XXXXXXXX)"
          maxLength={10}
          className="h-12 text-base border-2 focus:border-feature-users transition-colors duration-300 text-center"
          required
          autoComplete="tel"
          pattern="05[0-9]{8}"
          dir="ltr"
        />
      </div>

      {/* Password Input */}
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="كلمة المرور"
          className="h-12 text-base border-2 focus:border-feature-users transition-colors duration-300 pl-12"
          required
          minLength={6}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
    </div>
  );
}

// Form Actions Component (25 lines)
function FormActions({
  isPending,
  state
}: {
  isPending: boolean;
  state: { success: boolean; message: string } | null;
}) {
  return (
    <div className="space-y-4">
      {/* Status Message */}
      {state?.message && (
        <p className={cn(
          "text-sm text-center",
          state.success ? "text-feature-products" : "text-destructive"
        )}>
          {state.message}
        </p>
      )}

      {/* Login Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-12 bg-feature-users hover:bg-feature-users/90 text-white font-medium text-base transition-all duration-300"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin ml-2" />
            جارٍ تسجيل الدخول...
          </>
        ) : (
          <>
            تسجيل الدخول
            <ArrowRight className="h-4 w-4 mr-2" />
          </>
        )}
      </Button>
    </div>
  );
}

// Footer Links Component (20 lines)
function FooterLinks() {
  return (
    <div className="space-y-4 text-center">
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border"></div>
        <span className="text-xs text-muted-foreground">أو</span>
        <div className="flex-1 h-px bg-border"></div>
      </div>

      <div className="flex gap-4 text-sm">
        <a href="/auth/register" className="flex-1 text-feature-users hover:underline">
          إنشاء حساب جديد
        </a>
        <a href="/auth/forgot-password" className="flex-1 text-muted-foreground hover:text-foreground">
          نسيت كلمة المرور؟
        </a>
      </div>
    </div>
  );
}

// Main Login Component (30 lines)
export default function LoginPe({ redirect = '/' }: LoginFormProps) {
  log("LoginPe redirect prop:", redirect);

  const [state, addAction, isPending] = useActionState(userLogin, { success: false, message: '' });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Back Button */}
        <BackButton variant="minimal" />

        {/* Login Form */}
        <div className="space-y-8">
          <LoginHeader />

          <form action={addAction} className="space-y-6">
            {/* Hidden input for redirect */}
            <input type="hidden" name="redirect" value={redirect} />

            <FormFields
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />

            <FormActions
              isPending={isPending}
              state={state}
            />
          </form>

          <FooterLinks />
        </div>
      </div>
    </div>
  );
}
