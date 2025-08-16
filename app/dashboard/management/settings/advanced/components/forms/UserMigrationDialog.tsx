'use client';

import { useState, useEffect } from 'react';
import { Users, UserCheck, AlertCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  isOtp: boolean;
}

interface UserActivationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMigrate: (userIds: string[]) => Promise<void>;
}

export default function UserActivationDialog({
  open,
  onOpenChange,
  onMigrate,
}: UserActivationDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  // Fetch unverified users when dialog opens
  useEffect(() => {
    if (open) {
      fetchUnverifiedUsers();
    }
  }, [open]);

  const fetchUnverifiedUsers = async () => {
    setFetchingUsers(true);
    try {
      const response = await fetch('/api/users/unverified');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      toast.error('Error fetching users');
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(user => user.id)));
    }
  };

  const handleUserSelect = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleActivate = async () => {
    if (selectedUsers.size === 0) {
      toast.error('Please select users to activate');
      return;
    }

    setLoading(true);
    try {
      await onMigrate(Array.from(selectedUsers));
      toast.success(`Successfully activated ${selectedUsers.size} users`);
      onOpenChange(false);
      setSelectedUsers(new Set());
    } catch (error) {
      toast.error('Activation failed');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] max-h-[700px] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users className="h-5 w-5 text-primary" />
            تفعيل المستخدمين
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            تم إيقاف OTP. اختر المستخدمين الذين تريد تفعيلهم تلقائياً.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden min-h-0">
          {/* Header with Select All */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Checkbox
                id="select-all"
                checked={selectedUsers.size === users.length && users.length > 0}
                onCheckedChange={handleSelectAll}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                تحديد الكل
              </label>
            </div>
            <Badge variant="secondary" className="text-xs">
              {selectedUsers.size} من {users.length} محدد
            </Badge>
          </div>

          {/* Users List - Fixed Scrolling */}
          <div className="overflow-y-auto h-full pr-2 space-y-2 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            {fetchingUsers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">جاري تحميل المستخدمين...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <UserCheck className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium text-muted-foreground">لا يوجد مستخدمين</h3>
                <p className="text-sm text-muted-foreground">
                  جميع المستخدمين محققين بالفعل أو لا يوجد مستخدمين في النظام
                </p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors bg-background"
                >
                  <Checkbox
                    id={user.id}
                    checked={selectedUsers.has(user.id)}
                    onCheckedChange={() => handleUserSelect(user.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground truncate">
                        {user.name || 'مستخدم بدون اسم'}
                      </span>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        غير محقق
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="truncate">{user.email}</span>
                      <span className="truncate">{user.phone}</span>
                      <span className="text-xs flex-shrink-0">
                        مسجل في {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <Separator className="my-4 flex-shrink-0" />

        {/* Footer Actions */}
        <DialogFooter className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>
              سيتم تفعيل {selectedUsers.size} مستخدم إلى حالة محقق
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleActivate}
              disabled={loading || selectedUsers.size === 0}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  جاري التفعيل...
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  تفعيل المستخدمين المحددين
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
