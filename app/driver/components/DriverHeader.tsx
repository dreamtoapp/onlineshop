'use client';
import { Icon } from '@/components/icons/Icon';

interface DriverHeaderProps {
  drivername?: string;
  driverId: string;
  avatarUrl?: string;
  assignedOrders?: number;
}

const getInitial = (name?: string) => {
  if (!name) return '؟';
  return name.trim().charAt(0).toUpperCase();
};

const DriverHeader = ({ drivername = 'السائق', driverId, avatarUrl }: DriverHeaderProps) => {
  return (
    <header className="fixed top-0 z-50 w-full bg-background/98 backdrop-blur-md border-b border-border h-14 flex items-center justify-center">
      <div className="flex w-full max-w-md h-full items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={drivername}
              className="h-10 w-10 rounded-full object-cover border-2 border-border bg-background"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-primary font-bold text-lg border-2 border-border">
              {getInitial(drivername)}
            </div>
          )}
          <span className="text-lg font-bold text-primary-foreground">{drivername}</span>
        </div>
        <button
          className="flex items-center justify-center h-10 w-10 rounded-full bg-muted/80 text-primary focus:outline-none"
          onClick={() => {
            if (window.confirm('هل تريد تسجيل الخروج؟')) {
              window.location.href = '/api/auth/signout';
            }
          }}
          aria-label="تسجيل الخروج"
        >
          <Icon name="LogOut" className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default DriverHeader;
