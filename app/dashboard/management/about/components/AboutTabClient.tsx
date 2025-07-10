import AboutForm from './AboutForm';
import { Card } from '@/components/ui/card';
import { AboutFormValues } from '../actions/updateAboutPageContent';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface AboutTabClientProps {
    defaultValues?: Partial<AboutFormValues>;
    onSubmit: (values: AboutFormValues) => void;
    status?: string;
    error?: string;
}

export default function AboutTabClient({ defaultValues, onSubmit, status, error }: AboutTabClientProps) {
    useEffect(() => {
        if (status === 'success') {
            toast.success('تم الحفظ بنجاح');
        }
        if (error) {
            toast.error(error);
        }
    }, [status, error]);

    return (
        <Card className="p-6 mb-4">
            {error && <p className="text-red-500">{error}</p>}
            {defaultValues && (
                <AboutForm
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                />
            )}
            {status === 'success' && <p className="text-green-600 mt-2">تم الحفظ بنجاح</p>}
        </Card>
    );
} 