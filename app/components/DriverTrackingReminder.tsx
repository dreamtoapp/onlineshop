import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function DriverTrackingReminder() {
    return (
        <Alert variant="default" className="mb-4">
            <Info className="h-5 w-5 mr-2 text-blue-600" />
            <AlertTitle>Important Reminder</AlertTitle>
            <AlertDescription>
                Please do <b>not</b> fully close or swipe away the browser app while on a delivery trip.<br />
                You may minimize the browser or switch apps, but closing the browser will stop location tracking.
            </AlertDescription>
        </Alert>
    );
} 