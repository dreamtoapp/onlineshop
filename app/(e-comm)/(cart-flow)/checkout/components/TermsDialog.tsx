// components/Checkout/TermsDialog.tsx
'use client';
import { useEffect, useState } from 'react';
import { FileText, ExternalLink, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { getTerms, Term } from '../../../../dashboard/rulesandcondtions/actions/terms-actions';
// Removed Icon import: import { Icon } from '@/components/icons';

export default function TermsDialog() {
  const [open, setOpen] = useState(false);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTerms = async () => {
      if (open && terms.length === 0) {
        try {
          setLoading(true);
          setError('');
          const data = await getTerms();
          setTerms(data || []);
        } catch (err) {
          console.error('Error fetching terms:', err);
          setError('فشل تحميل الشروط والأحكام. يرجى المحاولة لاحقاً');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTerms();
  }, [open, terms.length]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="p-0 h-auto text-feature-commerce hover:text-feature-commerce/80 underline"
        >
          <FileText className="h-3 w-3 ml-1" />
          الشروط والأحكام
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] max-w-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-feature-commerce" />
            الشروط والأحكام وسياسة الخصوصية
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          {loading ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <Separator />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : terms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد شروط وأحكام متاحة حالياً</p>
            </div>
          ) : (
            <div className="space-y-6">
              {terms.map((term, index) => (
                <div key={term.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        القسم {index + 1}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        آخر تحديث: {new Date(term.updatedAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <div
                      className="text-sm leading-relaxed whitespace-pre-wrap text-foreground"
                      style={{ direction: 'rtl', textAlign: 'right' }}
                    >
                      {term.content}
                    </div>
                  </div>

                  {index < terms.length - 1 && <Separator className="my-4" />}
                </div>
              ))}

              {/* Contact Information */}
              <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  للاستفسارات والدعم
                </h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• يمكنك التواصل معنا عبر الواتساب للاستفسار عن أي بند</p>
                  <p>• جميع الشروط قابلة للتحديث وسيتم إشعارك بأي تغييرات</p>
                  <p>• استخدامك للموقع يعني موافقتك على هذه الشروط</p>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            بالمتابعة، أنت توافق على جميع الشروط المذكورة أعلاه
          </div>
          <Button
            onClick={() => setOpen(false)}
            className="btn-save"
          >
            فهمت وأوافق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
